var models = require('../db'),
    crypto = require('crypto');


var _register = function (email, password, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);

    var user = new models.Account({
        email:email,
        password:shaSum.digest('hex')
    });
    user.save(function (err, user) {
        if (err) console.log(err);
        callback(user);
    });
};

_register("root", "0p9o8i7u", function (user) {
    console.log(user.email);

    process.exit();
});