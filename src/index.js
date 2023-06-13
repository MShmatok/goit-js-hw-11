import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

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

refs.form.addEventListener('submit', onSearch);

async function onSearch(e) {
  e.preventDefault();
  clear();

  pixabay.query = String(refs.input.value).trim().toLocaleLowerCase();
  await render();
}

async function onLoadMore() {
  if (pixabay.hasNewPages()) {
    await render();
  }
}

async function render() {
  const markup = markupCreate(await pixabay.getPosts());
  refs.gallery.insertAdjacentHTML('beforeend', markup);

  pixabay.increaseCurPage();
  lightbox.refresh();

  const lastCard = document.querySelector(".js-card:last-child");
  if (lastCard) {
    infinteObserver.observe(lastCard);
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
  { threshold: 0 }
);

function clear() {
  refs.gallery.innerHTML = '';
}