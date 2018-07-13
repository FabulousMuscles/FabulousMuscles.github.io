'use strict';
(function () {
  var DEFAULT_NUMBER_VISIBLE_COMMENT = 5;

  var maxVisibleCommentsNumber;
  var index;
  var placedRenderedPicture;
  var bigPictureElement;
  var elementCommentsContainer;
  var elementComment;
  var visibleCommentCount;
  var loadMore;
  var errorLinks;
  var placedErrorElement;

  var renderBigPicture = function (arrayObjects) {
    visibleCommentCount = 0;
    maxVisibleCommentsNumber = 5;
    bigPictureElement = window.gallery.bigPictureBlock.cloneNode(true);
    bigPictureElement.querySelector('.big-picture__img').querySelector('img').src = arrayObjects.url;
    bigPictureElement.querySelector('.likes-count').textContent = arrayObjects.likes;

    loadMore = bigPictureElement.querySelector('.social__loadmore');
    loadMore.addEventListener('click', loadMoreClickHandler);
    removeDefaultComments();
    renderComments();

    return bigPictureElement;
  };

  var loadMoreClickHandler = function () {
    renderComments();
  };

  var removeDefaultComments = function () {
    elementCommentsContainer = bigPictureElement.querySelector('.social__comments');
    elementComment = bigPictureElement.querySelectorAll('.social__comment');
    for (var i = 0; i < elementComment.length; i++) {
      elementCommentsContainer.removeChild(elementComment[i]);
    }
  };

  var renderComments = function () {
    var commentsCount = bigPictureElement.querySelector('.social__comment-count');

    for (var i = visibleCommentCount; i < window.dataFile.downloadedObjects[index].comments.length; i++) {
      visibleCommentCount = i + 1;
      var elementCommentFragment = elementComment[0].cloneNode(true);
      elementCommentFragment.querySelector('img').src = 'img/avatar-' + Math.floor(Math.random() * 6 + 1) + '.svg';
      elementCommentFragment.querySelector('.social__text').textContent = window.dataFile.downloadedObjects[index].comments[i];
      elementCommentsContainer.appendChild(elementCommentFragment);
      commentsCount.textContent = visibleCommentCount + ' из ' + window.dataFile.downloadedObjects[index].comments.length + ' комментариев';
      if (visibleCommentCount === window.dataFile.downloadedObjects[index].comments.length) {
        bigPictureElement.querySelector('.social__loadmore').classList.add('hidden');
        loadMore.removeEventListener('click', loadMoreClickHandler);
      } else if (visibleCommentCount >= maxVisibleCommentsNumber) {
        maxVisibleCommentsNumber = maxVisibleCommentsNumber + DEFAULT_NUMBER_VISIBLE_COMMENT;

        return visibleCommentCount;
      }
    } return visibleCommentCount;
  };

  var closeGallery = function () {
    document.body.removeAttribute('class');
    window.gallery.main.removeChild(bigPictureElement);
    document.removeEventListener('keydown', galleryKeydownHandler);
  };

  var galleryKeydownHandler = function (evt) {
    if (evt.keyCode === window.dataFile.ESC_KEYCODE) {
      closeGallery();
    }
  };

  var placedRenderedPictureClickHandler = function (evt) {
    var target = evt.target;
    if (target.classList.contains('big-picture__cancel') || target.classList.contains('overlay')) {
      closeGallery();
    }
  };

  var renderDataPictures = function (arrayObjects) {
    window.gallery.bigPictureBlock.classList.remove('hidden');
    var renderedPicture = renderBigPicture(arrayObjects[index]);
    placedRenderedPicture = window.gallery.main.appendChild(renderedPicture);
    document.addEventListener('keydown', galleryKeydownHandler);
    placedRenderedPicture.addEventListener('click', placedRenderedPictureClickHandler);

    return placedRenderedPicture;
  };

  var errorLinksRemoveElement = function () {
    document.body.removeChild(placedErrorElement);
    placedErrorElement = '';
    window.scaleFilter.closePopup();
    errorLinks.removeEventListener('click', errorLinksClickHandler);
  };

  var errorLinksClickHandler = function (evt) {
    var target = evt.target;
    evt.preventDefault();
    if (target === errorLinks.firstElementChild) {
      window.backend.upload(new FormData(window.formFile.form), errorLinksRemoveElement, window.preview.errorBlockUploadFile);
    } else if (target === errorLinks.lastElementChild) {
      errorLinksRemoveElement();
    }
  };

  window.preview = {
    pictureMainBlockHandler: function (evt) {

      var target = evt.target;
      var elementTargetImg;
      if (target.classList.contains('picture__img') || target.classList.contains('picture__link')) {
        evt.preventDefault();
        document.body.classList.add('modal-open');
        if (target.classList.contains('picture__img')) {
          elementTargetImg = target.src;
        } else if (target.classList.contains('picture__link')) {
          elementTargetImg = target.firstElementChild.src;
        }
        for (var i = 0; i < window.dataFile.downloadedObjects.length; i++) {
          if (elementTargetImg.includes(window.dataFile.downloadedObjects[i].url)) {
            index = i;
            window.backend.load(renderDataPictures, window.preview.errorBlockLoadFile);
          }
        }
      }
    },
    errorBlockUploadFile: function (xhrdata) {
      if (!placedErrorElement) {
        var errorElement = document.querySelector('#picture')
    .content
      .querySelector('.img-upload__message--error');
        var fragment = document.createDocumentFragment();
        placedErrorElement = errorElement.cloneNode(true);
        fragment.appendChild(placedErrorElement);
        document.body.insertBefore(fragment, window.gallery.main);
        placedErrorElement.classList.remove('hidden');
        errorLinks = placedErrorElement.querySelector('.error__links').cloneNode(true);
        var errorStatus = document.querySelector('.error');
        errorStatus.textContent = xhrdata;
        errorStatus.appendChild(errorLinks);
        errorStatus.style = 'z-index: 99';
        errorStatus.style.position = 'fixed';
        errorLinks.addEventListener('click', errorLinksClickHandler);
      }
    },
    errorBlockLoadFile: function (errorMessage) {
      var errorElement = document.createElement('div');
      errorElement.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
      errorElement.style.position = 'absolute';
      errorElement.style.left = 0;
      errorElement.style.right = 0;
      errorElement.style.fontSize = '30px';

      errorElement.textContent = errorMessage;
      document.body.insertBefore(errorElement, window.gallery.main);
    },
    pictureMainBlockKeydownHandler: function (evt) {
      if (evt.keyCode === window.dataFile.ENTER_KEYCODE) {
        window.preview.pictureMainBlockHandler(evt);
      }
    }
  };
})();
