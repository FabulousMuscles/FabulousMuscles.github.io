'use strict';
(function () {
  var DEBOUNCE_INTERVAL = 300;
  var imgFiltersForm = document.querySelector('.img-filters__form');
  var lastTimeout;
  var shuffleArray = function (array) {
    var j;
    var temp;
    for (var i = array.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = array[j];
      array[j] = array[i];
      array[i] = temp;
    }
    return array;
  };

  var debounce = function (funRemovePic, funRenderPic) {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(function () {
      funRemovePic();
      funRenderPic();
    }, DEBOUNCE_INTERVAL);
  };

  var sortByTopDiscussed = function (sortedArray) {
    var sortedByTopObjects = sortedArray.slice()
    .sort(function (a, b) {
      return b.comments.length - a.comments.length;
    });
    return sortedByTopObjects;
  };

  var sortByNew = function (sortedArray) {
    var sortedByNewObjects = sortedArray.slice();
    sortedByNewObjects = shuffleArray(sortedByNewObjects).slice(15);
    return sortedByNewObjects;
  };

  var imgFiltersFormClickHandler = function (evt) {
    var target = evt.target;
    var activeButton = document.querySelector('.img-filters__button--active');
    if (target.classList.length === 1) {
      activeButton.classList.remove('img-filters__button--active');
      target.classList.add('img-filters__button--active');
      activeButton = target;
    } switch (target.id) {
      case 'filter-popular':
        var sortByPopularWrapper = function () {
          return window.picture.placeBlockPicturesHTML(window.dataFile.downloadedObjects);
        };

        debounce(window.picture.removeBlockPicturesHTML, sortByPopularWrapper);
        break;
      case 'filter-new':
        var sortByNewWrapper = function () {
          return window.picture.placeBlockPicturesHTML(sortByNew(window.dataFile.downloadedObjects));
        };

        debounce(window.picture.removeBlockPicturesHTML, sortByNewWrapper);
        break;
      case 'filter-discussed':
        var sortByTopDiscussedWrapper = function () {
          return window.picture.placeBlockPicturesHTML(sortByTopDiscussed(window.dataFile.downloadedObjects));
        };

        debounce(window.picture.removeBlockPicturesHTML, sortByTopDiscussedWrapper);
        break;
      default:
        throw new Error('Неизвестный фильтр');
    }
  };

  imgFiltersForm.addEventListener('click', imgFiltersFormClickHandler);
})();
