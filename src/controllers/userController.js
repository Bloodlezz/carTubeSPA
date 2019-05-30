const userModel = require('../models/userModel');
const carModel = require('../models/carModel');
const storage = require('../helpers/storage');
const validator = require('../helpers/validator');
const binder = require('../helpers/binder');
const hbsHelpers = require('../helpers/hbsHelpers');
const notificator = require('../helpers/notificator');

module.exports = (() => {

    function getRegister(context) {
        binder.bindPartials(context)
            .then(function () {
                this.partial('views/user/register.hbs');
            });
    }

    function postRegister(context) {
        let userData = binder.bindFormToObj(context.params);
        validator.validateFormData(userData, 'register');

        if (validator.isFormValid()) {
            if (userData.password === userData.repeatPass) {
                notificator.showLoading();
                delete userData.repeatPass;
                userModel.registerUser(userData)
                    .then((user) => {
                        notificator.hideLoading();
                        storage.saveSession(user);
                        this.redirect('#/');
                        notificator.showInfo('User registration successful.');
                    })
                    .catch(function (error) {
                        notificator.hideLoading();
                        notificator.handleError(error);
                    })
            } else {
                notificator.showError('Passwords do not match!');
            }
        }
    }

    function getLogin(context) {
        binder.bindPartials(context)
            .then(function () {
                this.partial('views/user/login.hbs');
            });
    }

    function postLogin(context) {
        let credentials = binder.bindFormToObj(context.params);
        validator.validateFormData(credentials, 'login');

        if (validator.isFormValid()) {
            notificator.showLoading();
            userModel.loginUser(credentials)
                .then((userData) => {
                    notificator.hideLoading();
                    storage.saveSession(userData);
                    this.redirect('#/');
                    notificator.showInfo('Login successful.');
                })
                .catch(function (error) {
                    notificator.hideLoading();
                    notificator.handleError(error);
                })
        }
    }

    function logout() {
        userModel.logoutUser()
            .then(() => {
                storage.clearSession();
                this.redirect('#/');
                notificator.showInfo('Logout successful.');
            })
            .catch(function (error) {
                notificator.handleError(error);
            });
    }

    function getMyList(context) {
        notificator.showLoading();
        carModel.getList()
            .then((cars) => {
                cars = cars
                    .sort((a, b) => {
                        let c = new Date(a._kmd.ect).getTime();
                        let d = new Date(b._kmd.ect).getTime();

                        return d - c;
                    })
                    .filter(car => car.seller === storage.getData('username'));

                context.cars = cars;
                context.cars = cars;
                if (cars.length === 0) {
                    context.isListEmpty = true;
                }

                hbsHelpers.isAuthor();
                binder.bindPartials(context)
                    .then(function () {
                        notificator.hideLoading();
                        this.partial('views/user/myList.hbs');
                    })
            })
            .catch(function (error) {
                notificator.hideLoading();
                notificator.handleError(error);
            })
    }

    return {
        getRegister,
        postRegister,
        getLogin,
        postLogin,
        getMyList,
        logout
    }
})();