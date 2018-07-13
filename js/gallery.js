'use strict';
(function () {
  window.gallery = {
    bigPictureBlock: document.querySelector('.big-picture'),
    main: document.querySelector('main'),
    pictureMainBlock: document.querySelector('.pictures'),
    pictureTemplate: document.querySelector('#picture')
  .content
  .querySelector('.picture__link')
  };

  window.gallery.main.removeChild(window.gallery.bigPictureBlock);


  window.backend.load(window.picture.placeBlockPicturesHTML, window.preview.errorBlockLoadFile);

  window.gallery.pictureMainBlock.addEventListener('click', window.preview.pictureMainBlockHandler);

  window.gallery.pictureMainBlock.addEventListener('keydown', window.preview.pictureMainBlockKeydownHandler);
})();
