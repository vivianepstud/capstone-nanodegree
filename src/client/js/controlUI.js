import * as moment from "moment"


/**
 * @description reset the interface so the user can insert a new trip
 */
export function resetInterface() {

    const sectionTripDetails = document.querySelector('.section-trip-details');
    const sectionFormBox = document.querySelector('.section-form-box');
    const formElements = document.querySelector("form.trip-info").children;
    for (let el of formElements) {
        if (el.tagName == 'INPUT') {
            el.value = "";
        }
    }
    sectionFormBox.classList.add('active');
    sectionTripDetails.classList.remove('active');
    document.querySelector('.container__new-trip').classList.remove('active');

}

/**
 * @description  Add data from api calls to the view
 * @param {Object} dataWeatherBit - data from weatherBit API
 * @param {Object} dataPixabay - data from Pixabay API
 * @param {String} startDate - initial date for the trip
 * @param {String} endDate - end date for the trip
 */
export function displayResults(dataWeatherBit, dataPixabay, startDate, endDate) {

    const sectionTripDetails = document.querySelector('.section-trip-details');
    const sectionFormBox = document.querySelector('.section-form-box');
    document.querySelector('.content__container__text__city-departure h4').textContent = `${String(dataWeatherBit.cityName).toUpperCase()}`
    document.querySelector('.content__container__text__country-departure h4').textContent = `${String(dataWeatherBit.countryCode).toUpperCase()}`
    if (dataPixabay.image)
        document.querySelector('.content__container__image__trip-details img').src = dataPixabay.image;
    document.querySelector('.content__container__text__departure-date h4').textContent = `${moment(startDate, "YYYY-MM-DD").format("MM/DD/YYYY")}`
    document.querySelector('.content__container__text__weather .weather-description').textContent = `${String(dataWeatherBit.weather).toUpperCase()}`;

    if (dataWeatherBit.weatherType === 'current') {
        document.querySelector('.content__container__text__weather h3').textContent = "CURRENT WEATHER";
        document.querySelector('.content__container__text__weather .weather-temperature').textContent = `Temperature ${dataWeatherBit.temperature} ºC`;

    } else {
        document.querySelector('.content__container__text__weather h3').textContent = "FORECASTED WEATHER";
        document.querySelector('.content__container__text__weather .weather-temperature').textContent = `Min ${dataWeatherBit.minTemperature} ºC - Max ${dataWeatherBit.maxTemperature} ºC `;

    }
    if (endDate) {
        document.querySelector('.content__container__text__arrival-date h4').textContent = `${moment(endDate, "YYYY-MM-DD").format("MM/DD/YYYY")}`;
        document.querySelector('.content__container__text__trip-length h4').textContent = `${moment(endDate, "YYYY-MM-DD").diff(moment(startDate, "YYYY-MM-DD"), 'days')} DAYS`;
        document.querySelector('.content__container__text__arrival-date').classList.add('active');
        document.querySelector('.content__container__text__trip-length').classList.add('active');
    } else {
        document.querySelector('.content__container__text__arrival-date').classList.remove('active');
        document.querySelector('.content__container__text__trip-length').classList.remove('active');
    }
    sectionFormBox.classList.remove('active');
    sectionTripDetails.classList.add('active');
    document.querySelector('.container__new-trip').classList.add('active');
}
/**
 * @description Controls the loading mode of the page, either leave or enter the  loading mode
 * @param {String} command - represents if the loading should be entered or left
 */
export function loadingMode(command) {
    const backdrop = document.querySelector('.backdrop');
    const loader = document.querySelector('.loader');
    if (command === 'enter') {
        backdrop.className = `${backdrop.className} active`;
        loader.className = `${loader.className} active`;
    } else if (command === 'leave') {
        setTimeout(() => {
            loader.className = 'loader';
            backdrop.className = 'backdrop';
        }, 300);
    }
}

/**
 * @description Leaves the loading mode of the page and communicates the a message to the user
 * @param {String} message - message to be communicated to the user
 */
export function communicateUser(message) {
    loadingMode('leave');
    alert(message);
}