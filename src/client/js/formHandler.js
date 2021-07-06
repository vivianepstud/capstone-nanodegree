import { checkFormValidity } from "./validationChecker";
import { displayResults, loadingMode, communicateUser } from "./controlUI.js"



/**
 * @description Fetches data from API and insert the results on the view
 * @param {Event} event
 *
 */
async function handleSubmit(event) {
    event.preventDefault();
    if (checkFormValidity()) {
        let payload = {};
        for (let el of event.target) {
            if (el.tagName == 'INPUT') {
                payload = {...payload,
                    ... {
                        [el.dataset.camelcase]: el.value
                    }
                }
            }
        }

        console.log('::: Form Submitted :::');
        loadingMode('enter');
        try {
            const promises = [];

            promises.push(fetch('http://localhost:8081/getLocationInfo', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            }));

            promises.push(fetch('http://localhost:8081/getLocationImage', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    location: payload.location
                }),
            }));
            const responses = await Promise.all(promises);
            console.log(48)
            const dataWeatherBit = await responses[0].json();
            const dataPixabay = await responses[1].json();
            if (dataWeatherBit.error) {
                communicateUser(dataWeatherBit.error);
                return;
            }
            console.log(55)
            console.log(dataWeatherBit);
            console.log(dataPixabay);
            displayResults(dataWeatherBit, dataPixabay, payload.startDate, payload.endDate);
            loadingMode('leave');
            return;

        } catch (error) {
            communicateUser('Service unavailable at the moment.');
        }
    } else {
        alert('One of the fields are invalid');
    }
}

export { handleSubmit }