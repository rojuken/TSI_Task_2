if (id) {
  // Запрос на получение данных
  fetch(`${SERVER_URL}/data?id=${id}`).then(res => {
    // Читаем данные
    res.json().then(data => {
      // Итерируем массив с данными
      data.forEach(dataItems => {
        // Добавляем в начало узла карточку созданную функцией createCard
        allMetersDataContainer.innerHTML =
          parseData(dataItems) + '<hr/>' + allMetersDataContainer.innerHTML;
      });
    });
  });
}

//  Функция создания карточки (рекурсия)
function parseData(data) {
  const { name, items, sub_items } = data;
  let html = '';

  html += `<p>`;

  html += `<b>${name}</b><br/>`;
  if (items) {
    html += items
      .map(item => {
        return `${item.label}: ${item.value}<br/>`;
      })
      .join('\n');
  }

  if (sub_items) {
    sub_items.forEach(subItem => {
      html += parseData(subItem);
    });
  }

  html += `</p>`;

  return html;
}
