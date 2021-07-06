// Import the js file to test
import { checkError, showError } from '../src/client/js/validationChecker';
import 'regenerator-runtime/runtime';

/**
 * @jest-environment jsdom
 */


describe("Testing the checkError function", () => {

    const formError = document.createElement('span');
    formError.id = 'form-error';
    const locationInput = document.createElement('input');
    locationInput.id = 'location';
    locationInput.name = 'location';
    locationInput.required = true;
    locationInput.pattern = '[a-zA-Z\s]+';
    document.body.appendChild(formError);
    document.body.appendChild(locationInput);

    test('Testing the showError function when input is empty', () => {
        locationInput.value = '';
        checkError(locationInput);
        const errorText = document.querySelector('.input-error').textContent
        expect(errorText).toEqual('Invalid location')
    });
});