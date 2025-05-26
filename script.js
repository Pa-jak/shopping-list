const form = document.getElementById('item-form');
const input = document.getElementById('item-input');
const list = document.getElementById('item-list');

let items = JSON.parse(localStorage.getItem('items')) || [];

function saveItems() {
  localStorage.setItem('items', JSON.stringify(items));
}

function renderItems() {
  list.innerHTML = '';
  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item.name;
    if (item.packed) li.classList.add('packed');
    li.addEventListener('click', () => {
      items[index].packed = !items[index].packed;
      saveItems();
      renderItems();
    });
    list.appendChild(li);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newItem = input.value.trim();
  if (newItem !== '') {
    items.push({ name: newItem, packed: false });
    saveItems();
    renderItems();
    input.value = '';
  }
});

renderItems();
