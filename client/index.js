const SERVER_URL = 'http://localhost:5000';

// Контейнер для вывода данных
const allMetersDataContainer = document.getElementById('all_meters_data');
// Текст текущего id
const idText = document.getElementById('id_text');
// Кнопка сброса id
const idDropButton = document.getElementById('id_drop_button');

//  Добавляем прослушивание события нажатия на кнопку сброса id
idDropButton.addEventListener('click', () => {
  // Вызываем функцию сброса id
  dropId();
  // Устанавливаем текст о том, что нет id
  setIdText('Нет id');
});

// Получение id из localStorage
const id = localStorage.getItem('id');

if (id) {
  // Если в localStorage есть id вызываем функцию установки текста ID
  setIdText(id);
}

// Функция установки текста id
function setIdText(id) {
  idText.innerText = `Текущий id: ${id}`;
}

// Функция сброса id
function dropId() {
  // Удаляем id из localStorage
  localStorage.removeItem('id');
  // Чистим данные
  if (allMetersDataContainer) {
    allMetersDataContainer.innerText = '';
  }
}
