const BACKEND_URL = "https://openai-kategoryzator.onrender.com";
const LIST_ID = "glowna";
const form = document.getElementById('item-form');
const input = document.getElementById('item-input');
const list = document.getElementById('item-list');

const getCategory = async (productName) => {
  try {
    const res = await fetch(`${BACKEND_URL}/kategoria`, {
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

const fetchItems = async () => {
  const res = await fetch(`${BACKEND_URL}/lista/${LIST_ID}`);
  const items = await res.json();
  renderItems(items);
};

const renderItems = (items) => {
  list.innerHTML = '';

  const grouped = {};
  items.forEach(item => {
    if (!grouped[item.category]) grouped[item.category] = [];
    grouped[item.category].push(item);
  });

  Object.keys(grouped).sort().forEach(category => {
    const header = document.createElement('h3');
    header.textContent = category;
    list.appendChild(header);

    grouped[category].forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.name;
      if (item.packed) li.classList.add('packed');
      li.addEventListener('click', async () => {
        await fetch(`${BACKEND_URL}/lista/${LIST_ID}/oznacz`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: item.name })
        });
        fetchItems();
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
    await fetch(`${BACKEND_URL}/lista/${LIST_ID}/dodaj`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category })
    });
    input.value = '';
    fetchItems();
  }
});

document.getElementById('clear-packed').addEventListener('click', async () => {
  await fetch(`${BACKEND_URL}/lista/${LIST_ID}/wyczysc`, {
    method: 'POST'
  });
  fetchItems();
});

fetchItems();
