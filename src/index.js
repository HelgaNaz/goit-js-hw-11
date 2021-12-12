import './sass/main.scss';

import { Notify } from 'notiflix/build/notiflix-notify-aio';

import { searchImages } from './class.js'

const searchForm = document.querySelector('#search-form');
const btnLoadMore = document.querySelector('.load-more');

// Параметры вывода сообщений
export const msgOptions = {
    position: 'center-top',
    distance: '75px',
    timeout: 2000,
    clickToClose: true
} 

const newGallery = new searchImages();

searchForm.addEventListener("submit", 
    (event) => {
        event.preventDefault();
        const [input] = event.currentTarget.elements;
        const value = (input.value).trim();
        console.log('value', value);

        if (value === "") {
            Notify.info(`Please, enter something`, msgOptions)
            return
        }

        newGallery.saveValue(value);

        newGallery.getImages(value)
            .then(data => newGallery.renderImages(data))
            .catch(error => console.log(error));
        
        event.currentTarget.reset();

});

btnLoadMore.addEventListener('click', () => {
    const currentValue = newGallery.getValue();
    console.log('currentValue', currentValue);
    newGallery.savePage();
    newGallery.nextPage();
    
})

 




 
