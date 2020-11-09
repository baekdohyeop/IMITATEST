var mongoose = require('mongoose');

module.exports = function () {
    function connect() {
        mongoose.connect('mongodb://localhost:27017/test10', function (err) {
            if (err) {
                console.error('mongodb connection error', err);
            }
            else {
                console.log('mongodb connected');
            }
        });
    }

    connect();
}