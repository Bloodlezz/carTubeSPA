const Handlebars = require('../../node_modules/handlebars/dist/handlebars.min');
const storage = require('../helpers/storage');

module.exports = (() => {

    function isActive() {
        Handlebars.registerHelper('isActive', function (hash) {
            return window.location.hash === hash ? 'active' : '';
        });
    }

    function formatDate() {
        Handlebars.registerHelper('formatDate', function (date) {
            let currentDate = new Date(date);
            return currentDate
                    .toLocaleDateString('ca-ES')
                + ' @ ' +
                currentDate.toLocaleTimeString('ca-ES');
        });
    }

    function isAuthor() {
        Handlebars.registerHelper('isAuthor', function (creatorId) {
            return storage.getData('userId') === creatorId;
        });
    }

    return {
        isActive,
        formatDate,
        isAuthor
    }
})();