/**
 * @description  Add new error Message, after deleting the old one
 * @param {HTMLElement} formError - element that contains errors
 * @param {String} text - string to be searched 
 * @param {String} newMessage - error message to be added 
 */
function insertNewMessage(formError, text, newMessage) {

    let p = document.createElement('p')
    p.className = "input-error"
    p.textContent = newMessage;

    for (let el of formError.children) {
        if (el.textContent.indexOf(text) !== -1) {
            formError.removeChild(el);
            formError.appendChild(p);
            return;
        }
    }
    formError.appendChild(p);

}


/**
 * @description  Checks if there is already an element which has the text provided
 * @param {HTMLElement} formError - element that contains errors
 * @param {String} text - string to be searched 
 * @returns {Boolean} inform is text was find in one of the elements
 */
function removeMessage(formError, text) {

    for (let el of formError.children) {
        if (el.textContent.indexOf(text) !== -1) {
            formError.removeChild(el);
            return 1;
        }
    }
    return 0;
}

/**
 * @description  Checks the validity of the passed element and
 * shows an appropriate error message
 *  Code inspiration: formValidator from MDN
 *https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
 * @param {HTMLElement} eventTarget - element with the user input
 */
function checkError(eventTarget) {

    const formError = document.querySelector('#form-error')
    if (eventTarget.validity.valid) {
        if (formError.className.indexOf('active') > -1) {
            removeMessage(formError, eventTarget.name)
            if (!formError.children) {
                formError.className = 'error';
            }
        }
        eventTarget.className = eventTarget.classList.remove('error');
        return;
    }
    let errorMessage = ''
    if (eventTarget.validity.valueMissing) {
        insertNewMessage(formError, eventTarget.name, `Invalid ${eventTarget.name}`)
    } else if (eventTarget.validity.patternMismatch) {
        insertNewMessage(formError, eventTarget.name, `Entered value needs to be a valid ${eventTarget.name} `);
        eventTarget.className = !eventTarget.className.includes('error') ?
            `${eventTarget.className} error` : eventTarget.className;

        formError.className = 'error active'
    }
}

/**
 * @description  Checks if there is an invalid input
 * @returns {Boolean} returns true if all the inputs are valid
 */
function checkFormValidity() {
    const inputs = document.querySelectorAll('.trip-info input');
    let validityStatus = true;
    for (let input of inputs) {
        if (input.required && !input.validity.valid) {
            validityStatus = false;
            checkError(input)
        }

    }
    return validityStatus;
}


export { checkError, checkFormValidity }