// Подключение библиотеки http для создания сервера
const http = require('http');
// Подключение библиотеки для работы с файловой системой
const fs = require('fs');
// Подключение библиотеки для парсинга URL адресов
const { parse: parseURL, URLSearchParams } = require('url');

// Хост
const host = 'localhost';
// Порт
const port = 5000;

// Функция  прослушивания запросов
const requestListener = function (req, res) {
  // CORS заголовки
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET',
  };

  // Сохранение данных
  if (req.method === 'POST' && req.url === '/save') {
    // Читаем данные
    req.on('data', buffer => {
      // Конвертируем в JSON
      const body = JSON.parse(buffer);
      // Получаем список файлов из папки './database
      const filesList = fs.readdirSync('./database');

      // Если у пользователя установлен id и существует файл
      if (body.hasOwnProperty('id') && filesList.includes(`${body.id}.json`)) {
        // Читаем файл пользователя
        const fileData = fs.readFileSync(`./database/${body.id}.json`);
        // Конвертируем в JSON
        const parsedData = JSON.parse(fileData);
        // Добовляем новые данные
        parsedData.push(body.data);

        // Обновляем файл
        fs.writeFileSync(
          `./database/${body.id}.json`,
          JSON.stringify(parsedData)
        );

        // Устанавливаем загловки и заканчиваем запрос
        res.writeHead(200, headers);
        res.end();
      } else {
        // Получаем id пользоваля как количество файлов в папке database
        const id = filesList.length;

        // Создаем файл и записываем данные
        fs.writeFileSync(`./database/${id}.json`, JSON.stringify([body.data]));
        // Устанавливаем загловки и заканчиваем запрос
        res.writeHead(200, { 'content-type': 'application/json', ...headers });
        res.write(JSON.stringify({ id }));
        res.end();
      }
    });
  }

  // Чтение данных по id
  if (req.method === 'GET' && req.url.startsWith('/data')) {
    // Парсим URL
    const url = parseURL(req.url);
    // Парсим параметры
    const params = new URLSearchParams(url.query);
    // Получаем id
    const id = params.get('id');

    // Читаем данные из файла
    const data = fs.readFileSync(`./database/${id}.json`).toString();
    // Устанавливаем загловки и заканчиваем запрос
    res.writeHead(200, { 'content-type': 'application/json', ...headers });
    res.write(data);
    res.end();
  }

  // Получение схемы формы из файла
  if (req.method === 'GET' && req.url.startsWith('/scheme')) {
    // Чтение файла
    const scheme = fs.readFileSync('./scheme.json').toString();

    // Устанавливаем загловки и заканчиваем запрос
    res.writeHead(200, { 'content-type': 'application/json', ...headers });
    res.write(scheme);
    res.end();
  }

  // Статус 404 если адрес не найден
  res.writeHead(404);
};

// Создание инстанса сервера
const server = http.createServer(requestListener);

// Запуск сервера
server.listen(port, host, () => {
  // Сообщение о том что сервер запущен
  console.log(`Сервер запущен, http://${host}:${port}`);
});
