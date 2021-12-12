import axios from 'axios';
// const axios = require('axios').default;

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
// Дополнительный импорт стилей
import "simplelightbox/dist/simple-lightbox.min.css";

import { msgOptions } from './index.js'

const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');

// Изначально кнопка скрыта
btnLoadMore.classList.add('is-hidden');

export class searchImages {
    constructor() {
        this.page = 1;
        this.perPage = 40;
        this.searchValue = '';
        this.lightbox = null;
    }

    getValue() {
        return this.searchValue;
    }

    getPage() {
        return this.page;
    }

    saveValue(value) {
        if (this.searchValue !== value) {
            this.page = 1;
            gallery.innerHTML = "";
            btnLoadMore.classList.add('is-hidden');
        }
        this.searchValue = value;
    }

    savePage() {
        this.page = this.page + 1;
    }

    getImages = async function(value, page = 1, perPage = 40) {
    const response = await axios.get(`https://pixabay.com/api/?key=24707679-a3504ea7675a537b24da98bef&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`)
    
        console.log('response.data', response.data)
    
        if (response.data.total === 0) {
            gallery.innerHTML = "";
            Notify.failure('Sorry, there are no images matching your search query. Please try again.', msgOptions);
            return
        } else if (response.data.total > 0 & page === 1) {
        
            Notify.info(`Hooray! We found ${response.data.totalHits} images.`, msgOptions)
        } else if (response.data.hits.length === 0) {
            console.log(response.data.hits.length)
            
            Notify.info(`We're sorry, but you've reached the end of search results.`, msgOptions)
            // Убрать кнопку
            btnLoadMore.classList.add('is-hidden')
            return 
        }
    return response.data
    }
    
    nextPage() {
        this.getImages(this.searchValue, this.page)
            .then(this.renderImages.bind(this))
            .then(this.scroll)
            .catch(error => console.log(error));
    }

    scroll() {
    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({
        top: cardHeight * 3,
        behavior: "smooth",
    });
    }
 
    renderImages = function (data) {
        
        if (!data) {
            return
        }
        
        const markup = data.hits
            .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
          
                return `
            <a class="gallery-link" href="${largeImageURL}">
            <div class="photo-card">
            <img class="photo-image"src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                <b>Likes</b>: ${likes}
                </p>
                <p class="info-item">
                <b>Views</b>: ${views}
                </p>
                <p class="info-item">
                <b>Comments</b>: ${comments}
                </p>
                <p class="info-item">
                <b>Downloads</b>: ${downloads}
                </p>
            </div>
            </div>
            </a>
             `
            })
            .join("");
      
        gallery.insertAdjacentHTML('beforeend', markup);
        
        if (!this.lightbox) {
            this.lightbox = new SimpleLightbox('.gallery a');
        } else { 
        this.lightbox.refresh()
    }
        // Добавить кнопку после отрисовки
        btnLoadMore.classList.remove('is-hidden');     
    }
}