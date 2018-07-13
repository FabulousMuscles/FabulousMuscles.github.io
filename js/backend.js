'use strict';
(function () {
  var LINK = {
    URL: 'https://js.dump.academy/kekstagram',
    URL_DATA: 'https://js.dump.academy/kekstagram/data'
  };
  window.backend = {
    upload: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          onLoad(xhr.response);
        } else {
          onError('Ошибка загрузки файла! ' + 'Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000;

      xhr.open('POST', LINK.URL);
      xhr.send(data);
    },
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.open('GET', LINK.URL_DATA);
      xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
          var imgFilters = document.querySelector('.img-filters');
          imgFilters.classList.remove('img-filters--inactive');
          window.dataFile.downloadedObjects = xhr.response.slice();
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = 10000;

      xhr.send();
    }
  };
})();
