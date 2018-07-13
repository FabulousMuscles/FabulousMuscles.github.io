'use strict';
(function () {

  window.picture = {
    renderPictures: function (arrayObjects) {
      var pictureElement = window.gallery.pictureTemplate.cloneNode(true);

      pictureElement.querySelector('.picture__img').src = arrayObjects.url;
      pictureElement.querySelector('.picture__stat--comments').textContent = arrayObjects.comments.length;
      pictureElement.querySelector('.picture__stat--likes').textContent = arrayObjects.likes;

      return pictureElement;
    },
    placeBlockPicturesHTML: function (arrayObjects) {
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < arrayObjects.length; i++) {
        fragment.appendChild(window.picture.renderPictures(arrayObjects[i]));
      }
      return window.gallery.pictureMainBlock.appendChild(fragment);
    },
    removeBlockPicturesHTML: function () {
      var pictureLinks = document.querySelectorAll('.picture__link');
      for (var i = 0; i < pictureLinks.length; i++) {
        window.gallery.pictureMainBlock.removeChild(pictureLinks[i]);
      }
    }
  };
})();
