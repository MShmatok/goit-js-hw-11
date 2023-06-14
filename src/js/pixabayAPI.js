import axios from 'axios';

const KEY = '37231533-205413eb498832325c7945ce4';
axios.defaults.baseURL = 'https://pixabay.com/api';


class PixabayAPI {
    #query = '';
    #per_page = 40;
    #current_page = 1;
    #totalPosts = 0;
    #hasPosts;

    async getPosts() {
        const params = {
            q: this.#query,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            page: this.#current_page,
            per_page: this.#per_page,
        }

        const { data: { hits, totalHits } } = await axios.get(`?key=${KEY}`, { params })
        this.#totalPosts = totalHits;
        this.#hasPosts = !(0 === hits.length);

        return hits;
    }

    resetPages() {
        this.#current_page = 1;
    }

    increaseCurPage() {
        this.#current_page += 1;

    }

    get totalPosts() {
        return this.#totalPosts;
    }

    get query() {
        return this.#query;
    }

    set query(newQuery) {
        this.#query = newQuery;
    }
    hasNewPages() {
        return this.#current_page < this.#totalPosts / this.#per_page;
    }
    hasPosts() {
        return this.#hasPosts;
    }
}

export { PixabayAPI };