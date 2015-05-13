var React = require('react');
var {Link, RouteHandler} = require('react-router');

var Home = React.createClass({
  render: function() {
    return (
      <div>
        Home
        <RouteHandler />
      </div>
    );
  }
});

module.exports = Home;