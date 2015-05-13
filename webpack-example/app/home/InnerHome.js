var Shared = require('./../common/Shared.js');

var Base = require('arale-base');

module.exports = Base.extend({
    attrs: {
        name: ''
    },
    talk: function() {
        alert('hi, ' + this.get('name'));
    }
});
