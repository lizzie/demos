var models = require('../db'),
    crypto = require('crypto'),

    global_config = require(__dirname + "/../assets/config");

var _changePassword = function (accountId, newpassword) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(newpassword);
    var hashedPassword = shaSum.digest('hex');
    models.Account.update({_id:accountId}, {$set:{password:hashedPassword}}, {upsert:false},
        function changePasswordCallback(err) {
            console.log('Change password done for account ' + accountId);
        });
};

var _forgotPassword = function (email, resetPasswordUrl, callback) {
    var user = models.Account.findOne({email:email}, function findAccount(err, doc) {
        if (err) {
            // Email address is not a valid user
            callback(false);
        } else {
            var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
            resetPasswordUrl += '?account=' + doc._id;
            smtpTransport.sendMail({
                from:'thisapp@example.com',
                to:doc.email,
                subject:'SocialNet Password Request',
                text:'Click here to reset your password: ' + resetPasswordUrl
            }, function forgotPasswordResult(err) {
                if (err) {
                    callback(false);
                } else {
                    callback(true);
                }
            });
        }
    });
};

var _login = function (email, password, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    models.Account.findOne({email:email, password:shaSum.digest('hex')}, function (err, doc) {
        callback(doc);
    });
};

var _findById = function (accountId, callback) {
    models.Account.findOne({_id:accountId}, function (err, doc) {
        callback(doc);
    });
};

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


function _auth(req, res, action, status, msg) {
    res.render("auth", {
        title:action || "login",
        config:global_config,
        nav:false,
        status:status || 0,
        message:msg || "",
        action:action || "login",
        isLogin:req.session.loggedIn
    });
}

exports.login = function (req, res) {
    if (req.route.method === "post") {
        var email = req.param('email', null);
        var password = req.param('password', null);

        if (null == email || email.length < 1
            || null == password || password.length < 1) {
            _auth(req, res, "login", -1, "Please input email and password");
            return;
        }

        _login(email, password, function (account) {
            if (!account) {
                _auth(req, res, "login", -1, "Please input correct email and password");
                return;
            }
            req.session.loggedIn = true;
            req.session.accountId = account._id;
            res.redirect("/dashboard")
        });

    } else {
        _auth(req, res);
    }
};

exports.logout = function (req, res) {
    req.logout();
    res.redirect("/");
};

exports.register = function (req, res) {
    if (req.route.method === "post") {
        var email = req.param('email', '');
        var password = req.param('password', null);

        if (null == email || email.length < 1
            || null == password || password.length < 1) {
            _auth(req, res, "register", -1, "Please input email and password");
            return;
        }

        _register(email, password, function (account) {
            if (!account) {
                _auth(req, res, "register", -1, "Save failed, Please try again later!");
            }
            req.session.loggedIn = true;
            req.session.accountId = account._id;
            _auth(req, res, "register", 1, "Register success and Redirecting in next 3 seconds.");
        });
    } else {
        _auth(req, res, "register");
    }
};