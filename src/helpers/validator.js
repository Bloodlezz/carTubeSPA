const storage = require('../helpers/storage');

module.exports = (() => {

    storage.saveAsJson('validator', {});

    function validateFormData(dataObj, formName) {
        let formsValidation = {
            register: regLoginValidation,
            login: regLoginValidation,
            create: createEditValidation,
            edit: createEditValidation
        };

        function regLoginValidation(dataObj, key) {
            let currentInput = $(`[name=${key}]`);

            switch (key) {
                case 'username':
                    const usernameRegex = RegExp('^[A-Za-z]{3,}$');
                    usernameRegex.test(dataObj[key])
                        ? validInput(currentInput)
                        : invalidInput(currentInput, 'Field must contains 3 or more latin letters!');
                    break;

                case 'password':
                case 'repeatPass':
                    const passwordRegex = RegExp('^[A-Za-z0-9]{6,}$');
                    passwordRegex.test(dataObj[key])
                        ? validInput(currentInput)
                        : invalidInput(currentInput, 'Field must contains 6 or more latin letters and digits!');
                    break;
            }
        }

        function createEditValidation(dataObj, key) {
            let currentInput = $(`[name=${key}]`);

            switch (key) {
                case 'title':
                    const titleRegex = RegExp('^.{1,33}$');
                    titleRegex.test(dataObj[key])
                        ? validInput(currentInput)
                        : invalidInput(currentInput, 'Minimum 1, maximum 33 characters allowed!');
                    break;

                case 'description':
                    const descriptionRegex = RegExp('^.{30,450}$');
                    descriptionRegex.test(dataObj[key])
                        ? validInput(currentInput)
                        : invalidInput(currentInput, 'Minimum 30, maximum 450 characters allowed!');
                    break;

                case 'model':
                    const modelRegex = RegExp('^.{4,11}$');
                    modelRegex.test(dataObj[key])
                        ? validInput(currentInput)
                        : invalidInput(currentInput, 'Minimum 4, maximum 11 characters allowed!');
                    break;

                case 'brand':
                case 'fuelType':
                    const validationRegex = RegExp('^.{1,11}$');
                    validationRegex.test(dataObj[key])
                        ? validInput(currentInput)
                        : invalidInput(currentInput, 'Minimum 1, maximum 11 characters allowed!');
                    break;

                case 'year':
                    const yearRegex = RegExp('^[0-9]{4}$');
                    yearRegex.test(dataObj[key])
                        ? validInput(currentInput)
                        : invalidInput(currentInput, 'Year must contains four digits!');
                    break;

                case 'price':
                    0 < dataObj[key] && dataObj[key] < 1000000
                        ? validInput(currentInput)
                        : invalidInput(currentInput, 'Maximum allowed price is 1000000 $!');
                    break;

                case 'imageUrl':
                    const imageUrlRegex = RegExp('^http?.+$');
                    imageUrlRegex.test(dataObj[key])
                        ? validInput(currentInput)
                        : invalidInput(currentInput, 'Image URL must start with "http"!');
                    break;
            }
        }

        for (let key in dataObj) {
            formsValidation[formName](dataObj, key);
        }
    }

    function isFormValid() {
        const formValidations = storage.getJson('validator');
        return !Object.values(formValidations).includes('invalid');
    }

    async function validInput(jqueryElement) {
        const inputName = jqueryElement.attr('name');
        storage.saveToValidator(inputName, 'valid');
        await $(`#${inputName}`)
            .hide('slow', () => {
                $(`#${inputName}`).remove();
            });
    }

    async function invalidInput(jqueryElement, message) {
        const inputName = jqueryElement.attr('name');
        storage.saveToValidator(inputName, 'invalid');

        await $(`#${inputName}`).remove();
        const errorDiv = $(`<div id="${inputName}" class="feedback text-danger">${message}</div>`);

        await jqueryElement.after(errorDiv);
        await errorDiv.show('slow');
    }

    function escapeSpecialChars(dataObj, excludeArr) {
        let result = {};

        function escape(string) {
            let escape = $('<p></p>');
            escape.text(string);

            return escape.text();
        }

        for (let key in dataObj) {
            if (excludeArr.includes(key)) {
                result[key] = dataObj[key];
            } else {
                result[key] = escape(dataObj[key]);
            }
        }

        return result;
    }

    return {
        validateFormData,
        isFormValid,
        escapeSpecialChars
    }
})();