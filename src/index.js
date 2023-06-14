import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { PixabayAPI } from "./js/pixabayAPI";
import { markupCreate } from './js/markupCreateAPI';
import { refs } from "./js/refs";

const pixabay = new PixabayAPI();


// LightBox
const lightBoxParams = {
  caption: true,
  captionSelector: 'img',
  captionType: 'attr',
  captionsData: 'alt',
  captionDelay: 250,
  captionClass: 'center',
};
var lightbox = new SimpleLightbox('.gallery a', lightBoxParams);

Notify.init({
  position: 'right-bottom',
  opacity: 0.9,
  clickToClose: true,
});

refs.form.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();
  clear();

  pixabay.resetPages();
  pixabay.query = String(refs.input.value).trim().toLocaleLowerCase();
  await render();

  if (!pixabay.hasPosts()) {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
  Notify.info(`Hooray! We found ${pixabay.totalPosts} images.`);
}

async function onLoadMore() {
  if (pixabay.hasNewPages()) {
    await render();
  }
  else {
    Notify.info("We're sorry, but you've reached the end of search results.");
  }
}

async function render() {
  try {
    const markup = markupCreate(await pixabay.getPosts());
    refs.gallery.insertAdjacentHTML('beforeend', markup);


    pixabay.increaseCurPage();
    lightbox.refresh();

    const lastCard = document.querySelector(".js-card:last-child");
    if (lastCard) {
      infinteObserver.observe(lastCard);
    }
  } catch (error) {
    Notify.failure(`Something went wrong! (${error.message})`);
  }
}

const infinteObserver = new IntersectionObserver(
  ([entry], observer) => {

    // проверяем что достигли последнего элемента
    if (entry.isIntersecting) {

      // перестаем его отслеживать
      observer.unobserve(entry.target);
      // и загружаем новую порцию контента
      onLoadMore();

    }
  },
  {
    threshold: 0,
    rootMargin: '1000px',
  }
);

function clear() {
  refs.gallery.innerHTML = '';
}

function scrollSmooth() {
  const { height: cardHeight } = document
    .querySelector(".gallery")
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}