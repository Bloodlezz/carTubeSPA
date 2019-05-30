const carModel = require('../models/carModel');
const storage = require('../helpers/storage');
const validator = require('../helpers/validator');
const binder = require('../helpers/binder');
const hbsHelpers = require('../helpers/hbsHelpers');
const notificator = require('../helpers/notificator');

module.exports = (() => {

    function list(context) {
        notificator.showLoading();
        carModel.getList()
            .then((cars) => {
                cars.sort((a, b) => {
                    let c = new Date(a._kmd.ect).getTime();
                    let d = new Date(b._kmd.ect).getTime();

                    return d - c;
                });

                context.cars = cars;
                if (cars.length === 0) {
                    context.isListEmpty = true;
                }

                hbsHelpers.isAuthor();
                binder.bindPartials(context)
                    .then(function () {
                        notificator.hideLoading();
                        this.partial('views/car/list.hbs');
                    })
            })
            .catch(function (error) {
                notificator.hideLoading();
                notificator.handleError(error);
            });
    }

    function details(context) {
        notificator.showLoading();
        const currentId = context.params.id;

        carModel.getDetails(currentId)
            .then((carData) => {
                context.carData = carData;
                hbsHelpers.isAuthor();
                binder.bindPartials(context)
                    .then(function () {
                        notificator.hideLoading();
                        this.partial('views/car/details.hbs');
                    })
            })
            .catch(function (error) {
                notificator.hideLoading();
                notificator.handleError(error);
            })
    }

    function getCreate(context) {
        binder.bindPartials(context)
            .then(function () {
                this.partial('views/car/create.hbs');
            });
    }

    function postCreate(context) {
        let carData = binder.bindFormToObj(context.params);
        validator.validateFormData(carData, 'create');

        if (validator.isFormValid()) {
            notificator.showLoading();
            carData = validator.escapeSpecialChars(carData, ['price', 'year']);
            carData.seller = storage.getData('username');
            carModel.createCar(carData)
                .then(() => {
                    notificator.hideLoading();
                    this.redirect('#/car/list');
                    notificator.showInfo('Car created successful.');
                })
                .catch(function (error) {
                    notificator.handleError(error);
                });
        } else {
            notificator.showError('Please fill all fields correctly!');
        }
    }

    function getEdit(context) {
        notificator.showLoading();
        let currentId = context.params.id;

        carModel.getCar(currentId)
            .then((carData) => {
                context.carData = carData;
                binder.bindPartials(context)
                    .then(function () {
                        notificator.hideLoading();
                        this.partial('views/car/edit.hbs');
                    })

            })
            .catch(function (error) {
                notificator.hideLoading();
                notificator.handleError(error);
            });
    }

    function postEdit(context) {
        let carData = binder.bindFormToObj(context.params);
        validator.validateFormData(carData, 'edit');

        if (validator.isFormValid()) {
            notificator.showLoading();
            carData = validator.escapeSpecialChars(carData, ['price', 'year']);
            carData.seller = storage.getData('username');
            carModel.editCar(carData)
                .then((car) => {
                    notificator.hideLoading();
                    this.redirect(`#/car/details/${car._id}`);
                    notificator.showInfo('Car edit successful.');
                })
                .catch(function (error) {
                    notificator.hideLoading();
                    notificator.handleError(error);
                });
        } else {
            notificator.showError('Please fill all fields correctly!');
        }
    }

    function remove(context) {
        let currentId = context.params.id;

        carModel.deleteCar(currentId)
            .then(() => {
                this.redirect('#/car/list');
                notificator.showInfo('Car deleted successfully.');
            })
            .catch(function (error) {
                notificator.handleError(error);
            });
    }

    return {
        list,
        details,
        getCreate,
        postCreate,
        getEdit,
        postEdit,
        remove
    }
})();