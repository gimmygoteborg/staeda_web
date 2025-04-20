let metadata = [];
let currentIndex = 0;
let isLoading = false;
let batchSize = 50; // default fallback

fetch('/metadata.json')
  .then(res => res.json())
  .then(data => {
    metadata = data.sort((a, b) => a.order - b.order);
    batchSize = calculateInitialBatchSize(); // determine how many to load
    renderNextBatch();
    window.addEventListener('scroll', handleScroll);
  });

  function calculateInitialBatchSize() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
  
    const itemMinWidth = 120; // from CSS
    const gridGap = 10;
    const totalPadding = 20; // .grid padding: 10px left + right
  
    const availableWidth = screenWidth - totalPadding;
    const colCount = Math.floor((availableWidth + gridGap) / (itemMinWidth + gridGap));
  
    const itemHeight = itemMinWidth + gridGap; // account for gap as row spacing too
    const rowCount = Math.ceil(screenHeight / itemHeight) + 2; // buffer rows
  
    return colCount * rowCount;
  }
  
function renderNextBatch() {
  if (isLoading) return;
  isLoading = true;

  const grid = document.getElementById('imageGrid');
  const end = Math.min(currentIndex + batchSize, metadata.length);
  for (let i = currentIndex; i < end; i++) {
    const item = metadata[i];
    const img = document.createElement('img');
    img.src = `images/${item.filename}`;
    img.alt = item.description;
    img.dataset.id = item.id;
    img.loading = "lazy";
    img.onclick = () => openPopup(item);
    grid.appendChild(img);
  }

  currentIndex = end;
  isLoading = false;

  if (currentIndex >= metadata.length) {
    window.removeEventListener('scroll', handleScroll);
  }
}

function handleScroll() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight;
  const clientHeight = document.documentElement.clientHeight;

  if (scrollTop + clientHeight >= scrollHeight - 100) {
    renderNextBatch();
  }
}



function openPopup(item) {
  const popup = document.getElementById('popup');
  const img = document.getElementById('popupImg');
  const desc = document.getElementById('popupDesc');
  const deleteBtn = document.getElementById('popupDeleteBtn');

  img.src = `images/${item.filename}`;
  desc.innerText = item.description;
  popup.classList.remove('hidden');

  deleteBtn.onclick = () => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteImage(item.id);
    }
  };
  
}

document.querySelector('.close').onclick = () =>
  document.getElementById('popup').classList.add('hidden');

document.getElementById('popup').onclick = e => {
  if (e.target.id === 'popup') {
    document.getElementById('popup').classList.add('hidden');
  }
};

function uploadImage() {
  const fileInput = document.getElementById('fileInput');
  const descInput = document.getElementById('descInput');
  const file = fileInput.files[0];
  const description = descInput.value;

  if (!file || !description) {
    alert('Please select a file and enter a description.');
    return;
  }

  const formData = new FormData();
  formData.append('image', file);
  formData.append('description', description);

  fetch('/upload', {
    method: 'POST',
    body: formData
  }).then(() => window.location.reload());
}

function addBlank() {
  const count = 5;
  const baseOrder = metadata.length;
  const baseId = Date.now();

  for (let i = 0; i < count; i++) {
    metadata.push({
      id: `blank_${baseId}_${i}`,
      filename: "blank_dots3.jpg",
      description: `Blank ${i + 1}`,
      order: baseOrder + i
    });
  }

  fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metadata)
  }).then(() => window.location.reload());
}

  

function deleteImage(id) {
  fetch('/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: id })
  }).then(() => window.location.reload());
}



function saveMetadata() {
  fetch('/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metadata)
  });
}
