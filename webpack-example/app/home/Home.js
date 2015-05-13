var InnerHome = require('./InnerHome.js');
var React = require('react');

var Component = React.createClass({
  render: function () {
    var aPig = new InnerHome({
      name: 'pig'
    });
    aPig.talk();
    return (
      <h1>Hello HOME world 5!</h1>
    );
  }
});

module.exports = Component;
