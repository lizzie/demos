/**
 * google auth
 * @auth: liz
 * @date: 2013-03-01
 */
define(function (require, exports, module) {
    var $ = require("$");


    var User = {};

    var signinBtn = $("#gplus-btn div");
    window.GooglePlusCallback = function () {
        gapi.signin.render(signinBtn[0], {
            callback:"GoolgeSigninCallback",
            clientid:"7403455960-u6jveotfuhd1gvjttgiogu8a8aci2e2f.apps.googleusercontent.com",
            cookiepolicy:"single_host_origin",
            requestvisibleactions:"http://schemas.google.com/AddActivity",
            scope:"https://www.googleapis.com/auth/plus.login",
            theme:"dark"
        });
    };
    window.GoolgeSigninCallback = function (authResult) {
        console.log(authResult);
        if (authResult['access_token']) {
            // Successfully authorized
            signinBtn.hide();

            /*$.ajax({
             type: "GET",
             url: "https://www.googleapis.com/plus/v1/people/me",
             async:false,
             contentType:"application/json",
             dataType:'jsonp',
             success:function (data) {
             console.log(data);
             },
             error:function (e) {
             console.log(e);
             }
             });*/
            return;
        } else if (authResult['error']) {
            alert("Sigin Error, Please try later!");
        }
        signinBtn.parent().removeClass("hide");
    };

    function disconnectUser(access_token) {
        var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' +
            access_token;

        // Perform an asynchronous GET request.
        $.ajax({
            type:'GET',
            url:revokeUrl,
            async:false,
            contentType:"application/json",
            dataType:'jsonp',
            success:function (nullResponse) {
                // Do something now that user is disconnected
                // The response is always undefined.
            },
            error:function (e) {
                // Handle the error
                // console.log(e);
                // You could point users to manually disconnect if unsuccessful
                // https://plus.google.com/apps
            }
        });
    }


    signinBtn.length && require.async("https://apis.google.com/js/client:plusone.js?onload=GooglePlusCallback");

    return User;
});