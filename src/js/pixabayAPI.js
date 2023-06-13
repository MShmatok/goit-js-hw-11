import axios from 'axios';

const KEY = '37231533-205413eb498832325c7945ce4';
axios.defaults.baseURL = 'https://pixabay.com/api';


class PixabayAPI {
    #query = '';
    #per_page = 40;
    #current_page = 1;
    #totalPages = 0;

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
        this.#totalPages = totalHits;

        return hits;
    }

    resetPages() {
        this.#current_page = 1;
    }

    increaseCurPage() {
        this.#current_page += 1;

    }

    get totalPages() {
        return this.#totalPages;
    }

    get query() {
        return this.#query;
    }

    set query(newQuery) {
        this.#query = newQuery;
    }
    hasNewPages() {
        return this.#current_page < this.#totalPages / this.#per_page;
    }
}

export { PixabayAPI };