const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const carController = require('./controllers/carController');
import Sammy from '../node_modules/sammy/lib/sammy';
import '../node_modules/sammy/lib/plugins/sammy.handlebars';

const app = Sammy('#container', router);

$(() => {
    app.run('#/');
});

function router() {
    this.use('Handlebars', 'hbs');

    this.route('get', '#/', homeController.index);

    this.route('get', '#/user/register', userController.getRegister);
    this.route('post', '#/user/register', userController.postRegister);

    this.route('get', '#/user/login', userController.getLogin);
    this.route('post', '#/user/login', userController.postLogin);

    this.route('get', '#/user/logout', userController.logout);

    this.route('get', '#/car/list', carController.list);
    this.route('get', '#/car/details/:id', carController.details);

    this.route('get', '#/car/create', carController.getCreate);
    this.route('post', '#/car/create', carController.postCreate);

    this.route('get', '#/car/edit/:id', carController.getEdit);
    this.route('post', '#/car/edit/:id', carController.postEdit);

    this.route('get', '#/car/delete/:id', carController.remove);

    this.route('get', '#/user/myList', userController.getMyList);
}