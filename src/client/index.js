import { handleSubmit } from './js/formHandler';
import { checkError } from './js/validationChecker';
import { resetInterface } from './js/controlUI';
import './styles/resets.scss';
import './styles/base.scss';
import './styles/form.scss';
import './styles/header.scss';
import './styles/details.scss';
import * as moment from "moment"

const inputLocation = document.querySelector('#location');
const inputTripStart = document.querySelector('#start-date');
const inputTripEnd = document.querySelector('#return-date');
const buttonNewTrip = document.querySelector('.button-new-trip');
inputLocation.addEventListener('input', (event) => {
    checkError(event.target);
});

inputTripStart.addEventListener('input', (event) => {
    checkError(event.target);
    inputTripEnd.min = event.target.value;
});

window.addEventListener('DOMContentLoaded', (event) => {
    inputTripStart.min = moment().format("YYYY-MM-DD");
    console.log('DOM fully loaded and parsed');
})

export {
    checkError,
    handleSubmit,
};