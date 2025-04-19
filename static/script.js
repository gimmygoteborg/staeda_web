let metadata = [];

fetch('/metadata.json')
  .then(res => res.json())
  .then(data => {
    metadata = data.sort((a, b) => a.order - b.order);
    renderImages();
  });

function renderImages() {
  const grid = document.getElementById('imageGrid');
  grid.innerHTML = '';
  metadata.forEach((item, index) => {
    const img = document.createElement('img');
    img.src = `images/${item.filename}`;
    img.alt = item.description;
    img.dataset.id = item.id;
    img.onclick = () => openPopup(item);
    grid.appendChild(img);
  });

  Sortable.create(grid, {
    animation: 150,
    onEnd: function () {
      const newOrder = [...grid.children].map(img => img.dataset.id);
  
      metadata = newOrder.map((id, index) => {
        const item = metadata.find(m => m.id === id);
        return { ...item, order: index };
      });
  
      saveMetadata();
    }
  });
  
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
