const requester = require('../helpers/requester');

module.exports = (() => {

    function getList() {
        return requester.get('appdata', 'cars', 'kinvey');
    }

    function getDetails(id) {
        return requester.get('appdata', `cars/${id}`, 'kinvey');
    }

    function createCar(carData) {
        return requester.post('appdata', 'cars', 'kinvey', carData);
    }

    function getCar(id) {
        return requester.get('appdata', `cars/${id}`, 'kinvey');
    }

    function editCar(carData) {
        return requester.update('appdata', `cars/${carData.id}`, 'kinvey', carData);
    }

    function deleteCar(id) {
        return requester.remove('appdata', `cars/${id}`, 'kinvey');
    }

    return {
        getList,
        getDetails,
        createCar,
        getCar,
        editCar,
        deleteCar
    }
})();