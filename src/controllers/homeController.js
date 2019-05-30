const binder = require('../helpers/binder');

module.exports = (() => {

    function index(context) {
        binder.bindPartials(context)
            .then(function () {
                this.partial('views/home/home.hbs');
            })
    }

    return {
        index
    }
})();