'use strict';
(function () {
  window.formFile = {
    form: document.querySelector('.img-upload__form')
  };
  var form = document.querySelector('.img-upload__form');
  var inputValue = document.querySelector('.img-upload__text');
  var textInput = document.querySelector('.img-upload__text');

  var textInputFocusHandler = function () {
    document.removeEventListener('keydown', window.scaleFilter.popupKeydownHandler);
  };

  var textInputBlurHandler = function () {
    document.addEventListener('keydown', window.scaleFilter.popupKeydownHandler);
  };

  var isIdentically = function (element, array) {
    var isIdentical = false;
    for (var i = 0; i < array.length; i++) {
      if (element.toLowerCase() !== array[i].toLowerCase()) {
        isIdentical = true;
      }
    } return isIdentical;
  };

  var isMoreThanOneHashtagSymbol = function (element) {
    var isTrue = false;
    var hashtagArrayFirstElement = element;
    for (var i = 1; i < hashtagArrayFirstElement.length; i++) {
      if (hashtagArrayFirstElement[i] === '#') {
        isTrue = true;
      }
    } return isTrue;
  };

  var textInputValueInputHandler = function (evt) {
    var target = evt.target;
    if (target.classList.contains('text__hashtags')) {
      var hashtagArray = target.value.split(/\s* \s*/);
      for (var i = 0; i < hashtagArray.length; i++) {
        switch (true) {
          case target.value === '':
            target.setCustomValidity('');
            break;
          case hashtagArray[i].length === 0 && hashtagArray[i].indexOf('') === 0:
            target.setCustomValidity('');
            break;
          case hashtagArray.length > 5:
            target.setCustomValidity('Нельзя указать больше пяти хэш-тегов');
            break;
          case hashtagArray[i].indexOf(',') !== -1:
            target.setCustomValidity('хэш-теги разделяются пробелами');
            break;
          case hashtagArray[i].indexOf('#') !== 0:
            target.setCustomValidity('хэш-тег начинается с символа # (решётка)');
            break;
          case hashtagArray[i].length === 1 && hashtagArray[i].indexOf('#') === 0:
            target.setCustomValidity('хеш-тег не может содержать только решётку');
            break;
          case isMoreThanOneHashtagSymbol(hashtagArray[i]):
            target.setCustomValidity('один хеш-тег может содержать только одну решётку');
            break;
          case hashtagArray[i].length > 20:
            target.setCustomValidity('максимальная длина одного хэш-тега 20 символов, включая решётку');
            break;
          case !isIdentically(hashtagArray[i], hashtagArray) && hashtagArray.length !== 1:
            target.setCustomValidity('один и тот же хэш-тег не может быть использован дважды');
            break;
          default:
            target.setCustomValidity('');
        }
      }
    }
    return hashtagArray;
  };

  var formSubmitHandler = function (evt) {
    window.backend.upload(new FormData(window.formFile.form), window.scaleFilter.closePopup, window.preview.errorBlockUploadFile);
    evt.preventDefault();
  };

  inputValue.addEventListener('input', textInputValueInputHandler);

  textInput.addEventListener('focus', textInputFocusHandler, true);

  textInput.addEventListener('blur', textInputBlurHandler, true);

  form.addEventListener('submit', formSubmitHandler);

})();
