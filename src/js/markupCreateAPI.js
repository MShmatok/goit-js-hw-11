function markupCreate(arr) {
    return arr.map(({ webformatURL, tags, largeImageURL, likes, views, comments, downloads }) => {
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
`;
    }).join('');

}

export { markupCreate };
