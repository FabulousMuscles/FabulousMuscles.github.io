'use strict';
(function () {
  var MAX_VALUE = 100;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var resizeControlValue = document.querySelector('.resize__control--value');
  var inputTarget;
  var effectsList = document.querySelector('.effects__list');
  var scaleWrapper = document.querySelector('.img-upload__scale');
  var scaleLine = document.querySelector('.scale__line');
  var scaleValue = document.querySelector('.scale__value');
  var scalePin = scaleLine.querySelector('.scale__pin');
  var scaleLevel = scaleLine.querySelector('.scale__level');
  var uploadSelectImage = document.querySelector('#upload-select-image');
  var uploadFileInput = uploadSelectImage.querySelector('#upload-file');
  var imgUploadPreviewWrapper = uploadSelectImage.querySelector('.img-upload__preview');
  var imgPreview = imgUploadPreviewWrapper.querySelector('img');
  var imgUploadPreviewFilterClass;

  window.scaleFilter = {
    popupKeydownHandler: function (evt) {
      if (evt.keyCode === window.dataFile.ESC_KEYCODE) {
        window.scaleFilter.closePopup();
      }
    },
    imgUpload: uploadSelectImage.querySelector('.img-upload__overlay'),
    closePopup: function () {
      window.scaleFilter.imgUpload.classList.add('hidden');
      document.removeEventListener('keydown', window.scaleFilter.popupKeydownHandler);
      var inputImg = document.querySelector('.img-upload__input');
      inputImg.value = '';
    }
  };

  var setDefaultImgSettings = function () {
    resizeControlValue.value = MAX_VALUE + '%';
    imgUploadPreviewWrapper.style = 'transform: scale(' + (Number(resizeControlValue.value.replace('%', '')) / MAX_VALUE) + ')';
    scaleValue.value = 0;
    document.querySelector('#effect-none').checked = true;
  };

  var openPopup = function () {
    setDefaultImgSettings();

    if (imgPreview.classList.item(0)) {
      imgPreview.removeAttribute('class');

      if (imgPreview.hasAttribute('style')) {
        imgPreview.removeAttribute('style');
      }
    }
    window.scaleFilter.imgUpload.classList.remove('hidden');
    scaleWrapper.classList.add('hidden');
    document.addEventListener('keydown', window.scaleFilter.popupKeydownHandler);
  };

  var inputChangeHandler = function () {
    openPopup();
    var file = uploadFileInput.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        imgPreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  };

  var inputFocusHandler = function (evt) {
    var target = evt.target;
    if (target.tagName === 'INPUT') {
      inputTarget = target;
    }
    return inputTarget;
  };

  var toggleFiltres = function (evt) {
    var target = evt.target;
    var filterEffectButton;
    if (target.tagName === 'INPUT') {
      filterEffectButton = target.nextElementSibling.firstElementChild;
    } else if (target.tagName === 'LABEL') {
      filterEffectButton = target.firstElementChild;
    }
    scaleValue.value = MAX_VALUE;
    scaleLevel.style.width = window.dataFile.MAX_SCALE_WIDTH + '%';
    scalePin.style.left = scaleLevel.style.width;
    imgPreview.classList.add(filterEffectButton.classList.item(1));

    if (imgPreview.classList.item(0) !== filterEffectButton.classList.item(1)) {
      imgPreview.classList.remove(imgPreview.classList.item(0));
      imgPreview.style = '';
      imgPreview.classList.add(filterEffectButton.classList.item(1));
    } else if (imgPreview.classList.item(0)) {
      imgPreview.style = '';
    }

    if (imgPreview.classList.contains('effects__preview--none')) {
      scaleWrapper.classList.add('hidden');
      scaleValue.value = 0;
    } else if (!imgPreview.classList.contains('effects__preview--none') || scaleWrapper.classList.contains('hidden')) {
      scaleWrapper.classList.remove('hidden');
    }

    imgUploadPreviewFilterClass = imgPreview;

    return imgUploadPreviewFilterClass;
  };

  var scaleValueFilters = function () {
    if (imgUploadPreviewFilterClass) {
      if (inputTarget.value === 'chrome') {
        imgUploadPreviewFilterClass.style = 'filter: grayscale(' + 1 * (scaleValue.value / 100) + ')';
      } else if (inputTarget.value === 'sepia') {
        imgUploadPreviewFilterClass.style = 'filter: sepia(' + 1 * (scaleValue.value / 100) + ')';
      } else if (inputTarget.value === 'marvin') {
        imgUploadPreviewFilterClass.style = 'filter: invert(' + 100 * (scaleValue.value / 100) + '%)';
      } else if (inputTarget.value === 'phobos') {
        imgUploadPreviewFilterClass.style = 'filter: blur(' + 5 * (scaleValue.value / 100) + 'px)';
      } else if (inputTarget.value === 'heat') {
        imgUploadPreviewFilterClass.style = 'filter: brightness(' + 3 * (scaleValue.value / 100) + ')';
      }
    }

    return imgUploadPreviewFilterClass.style;
  };

  var imgUploadClickHandler = function (evt) {
    var target = evt.target;
    if (target.id === 'upload-cancel') {
      window.scaleFilter.closePopup();
    } else if (target.name === 'effect') {
      toggleFiltres(evt);
    } else if (target.classList.contains('resize__control')) {
      resizeImage(evt);
    }

    return target;
  };

  var resizeImage = function (evt) {
    var target = evt.target;
    if (target.classList.contains('resize__control--minus')) {
      resizeControlValue.value = resizeControlValue.value.replace('%', '');
      resizeControlValue.value = Number(resizeControlValue.value) - (MAX_VALUE / 4) + '%';
      if (Number(resizeControlValue.value.replace('%', '')) < 25) {
        resizeControlValue.value = 25 + '%';
      }
    } else if (target.classList.contains('resize__control--plus')) {
      resizeControlValue.value = resizeControlValue.value.replace('%', '');
      resizeControlValue.value = Number(resizeControlValue.value) + (MAX_VALUE / 4) + '%';
      if (Number(resizeControlValue.value.replace('%', '')) > MAX_VALUE) {
        resizeControlValue.value = MAX_VALUE + '%';
      }
    } imgUploadPreviewWrapper.style = 'transform: scale(' + (Number(resizeControlValue.value.replace('%', '')) / MAX_VALUE) + ')';

    return resizeControlValue;
  };

  var scaleLineMousedownHandler = function (evt) {
    var startCoordsX = evt.clientX;

    var scaleLineMousemoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var moveLimit = scaleLine.offsetWidth;
      var shiftX = startCoordsX - moveEvt.clientX;

      startCoordsX = moveEvt.clientX;

      var newOffsetLeft = (scalePin.offsetLeft - shiftX) / moveLimit * 100;

      if (newOffsetLeft < 0) {
        newOffsetLeft = 0;
      } else if (newOffsetLeft > 100) {
        newOffsetLeft = 100;
      }
      scaleLevel.style.width = newOffsetLeft + '%';
      scalePin.style.left = scaleLevel.style.width;
      scaleValue.value = Math.round(newOffsetLeft);
      scaleValueFilters();
    };

    var scalePinMouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', scaleLineMousemoveHandler);
      document.removeEventListener('mouseup', scalePinMouseUpHandler);
    };
    document.addEventListener('mousemove', scaleLineMousemoveHandler);
    document.addEventListener('mouseup', scalePinMouseUpHandler);
  };

  var imgUploadKeydownHandler = function (evt) {
    var target = evt.target;
    if (evt.keyCode === window.dataFile.ENTER_KEYCODE && target.classList.contains('effects__label')) {
      toggleFiltres(evt);
    }
  };

  uploadFileInput.addEventListener('change', inputChangeHandler);
  window.scaleFilter.imgUpload.addEventListener('click', imgUploadClickHandler);
  window.scaleFilter.imgUpload.addEventListener('keydown', imgUploadKeydownHandler);
  effectsList.addEventListener('focus', inputFocusHandler, true);
  scaleLine.addEventListener('mousedown', scaleLineMousedownHandler);

})();
