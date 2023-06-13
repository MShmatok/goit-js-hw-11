import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  page: 1,
  query: '',
}
const lightBoxParams = { caption: true, captionSelector: 'img', captionType: 'attr', captionsData: 'alt', captionDelay: 250, captionClass: 'center' };
var lightbox = new SimpleLightbox('.gallery a', lightBoxParams);

refs.form.addEventListener('submit', (e) => {
  e.preventDefault();
  refs.page = 1;
  refs.query = e.currentTarget.elements.searchQuery.value;
  console.dir();
  fetchSearch(refs.query, refs.page).then(renderImagePost);
  refs.page += 1;
})


const infinteObserver = new IntersectionObserver(
  ([entry], observer) => {

    // проверяем что достигли последнего элемента
    if (entry.isIntersecting) {

      // перестаем его отслеживать
      observer.unobserve(entry.target);
      // и загружаем новую порцию контента
      fetchSearch(refs.query, refs.page++).then(renderImagePost);

    }
  },
  { threshold: 0 }
);

function fetchSearch(query, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '37231533-205413eb498832325c7945ce4';

  // let query = query;
  // let page = 1;
  let per_page = 40;
  let fullUrl = `${BASE_URL}?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`;


  return fetch(fullUrl).then(r => {
    if (!r.ok) {
      throw new Error(r.status)
    }
    return r.json();
  });
}

function search(query, page) {
  fetchSearch(query, page)
    .then(resp => {
      console.log('last');
      // renderImagePost(resp);
      console.log('last 2');
      const lastCard = document.querySelector(".js-card:last-child");
      console.log(lastCard);
      if (lastCard) {
        console.log('last');
        infinteObserver.observe(lastCard);
      }
    }).catch((err) => {
      console.log(err.status);
    }
    )
}


function renderImagePost({ hits }) {
  const markup = hits.map(({ webformatURL, tags, largeImageURL, likes, views, comments, downloads }) => {
    return `
   <div class="photo-card items-set js-card">
  <a href="${largeImageURL}">
    <div class="thumb">
      <img class="img" src="${webformatURL}" alt="${tags}" loading="lazy" />
    </div>
     </a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
 
</div>
`
      ;
  }).join('');

  refs.gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();


  const lastCard = document.querySelector(".js-card:last-child");

  if (lastCard) {

    infinteObserver.observe(lastCard);
  }
}