// Форма для ввода данных
const generatedForm = document.getElementById('generated_form');

// Запрос схемы данных для формы
fetch(`${SERVER_URL}/scheme`).then(res => {
  // Чтение данных
  res.json().then(data => {
    // Добавление формы в DOM дерево
    generatedForm.innerHTML = generateForm(data) + generatedForm.innerHTML;
    // Начало прослушивания формы
    listenGeneratedForm(data);
  });
});

// Функция генерации формы
function generateForm(scheme) {
  // Генерация html структуры с помощью рекурсии
  const { name, items, sub_items } = scheme;
  let html = '';

  html += '<fieldset>';
  html += `<legend>${name}</legend>`;

  if (items) {
    items.forEach(item => {
      html += `<label for="${item.key}">${item.label}</label>\n`;
      html += `<input id="${item.key}" name=${item.key} type="${item.type}" />\n`;
    });
  }

  if (sub_items) {
    sub_items.forEach(subItem => {
      html += generateForm(subItem);
    });
  }

  html += '</fieldset>';

  return html;
}

// Функция запуска прослушивания события отправки формы
function listenGeneratedForm(scheme) {
  // Добавляем прослушивание
  generatedForm.addEventListener('submit', event => {
    // Отключение поведения по умолчанию (обновление страницы)
    event.preventDefault();

    // Создаем объект для отправки данных на сервер
    const data = { data: parseFormData(scheme) };

    // Получаем id из localStorage
    const id = localStorage.getItem('id');
    if (id) {
      // Если в localStorage есть id добавляем его в данные для отправки
      data.id = id;
    }

    // Делаем запрос к серверу
    fetch(`${SERVER_URL}/save`, {
      // Устанавливаем метод запроса
      method: 'post',
      // Устанавливаем тело запроса, конвертируем объект JS в текст
      body: JSON.stringify(data),
      // Если запрос выполнен успешно
    }).then(res => {
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        // Читаем данные
        res.json().then(data => {
          // Если в данных есть поле id
          if (data.hasOwnProperty('id')) {
            // Устанавливаем id
            setIdText(data.id);
            localStorage.setItem('id', data.id);
          }
        });
      }
    });
  });
}

// Функция обработки введенных данных (рекурсия)
function parseFormData(scheme) {
  const { name, items, sub_items } = scheme;
  const data = {
    name,
    // создание нового массива
    items: items.map(item => {
      return {
        label: item.label,
        key: item.key,
        type: item.type,
        // добавление значения с установленным типом
        value: typeConvert(item.type, generatedForm.elements[item.key].value),
      };
    }),
  };

  //  если есть субэлементы
  if (sub_items) {
    data.sub_items = sub_items.map(subItem => {
      return parseFormData(subItem);
    });
  }

  return data;
}

// Функция для приведения типов
function typeConvert(type, value) {
  if (type === 'number') {
    return Number(value);
  } else if (type === 'string') {
    return String(value);
  }
}
