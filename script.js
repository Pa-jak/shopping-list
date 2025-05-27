const form = document.getElementById('item-form');
const input = document.getElementById('item-input');
const list = document.getElementById('item-list');
let items = JSON.parse(localStorage.getItem('items')) || [];

const getCategory = async (productName) => {
  try {
    const res = await fetch('https://openai-kategoryzator.onrender.com/kategoria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ produkt: productName })
    });

    const data = await res.json();
    return data.kategoria || 'Inne';
  } catch (err) {
    console.error('Błąd podczas pobierania kategorii:', err);
    return 'Inne';
  }
};

const saveItems = () => {
  localStorage.setItem('items', JSON.stringify(items));
};

const renderItems = () => {
  list.innerHTML = '';

  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });

  Object.keys(grouped).sort().forEach(category => {
    const header = document.createElement('h3');
    header.textContent = category;
    list.appendChild(header);

    grouped[category].forEach((item, index) => {
      const li = document.createElement('li');
      li.textContent = item.name;
      if (item.packed) li.classList.add('packed');
      li.addEventListener('click', () => {
        const realIndex = items.findIndex(
          el => el.name === item.name && el.category === item.category
        );
        if (realIndex !== -1) {
          items[realIndex].packed = !items[realIndex].packed;
          saveItems();
          renderItems();
        }
      });
      list.appendChild(li);
    });
  });
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = input.value.trim();
  if (name) {
    const category = await getCategory(name);
    items.push({ name, category, packed: false });
    saveItems();
    renderItems();
    input.value = '';
  }
});

document.getElementById('clear-packed').addEventListener('click', () => {
  items = items.filter(item => !item.packed);
  saveItems();
  renderItems();
});

renderItems();
