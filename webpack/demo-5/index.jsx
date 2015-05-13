var App = require('./App');
var React = require('react');
var Home = require('./Home');
var About = require('./About');
/*var Router = require('react-router');
var {DefaultRoute, Route} = Router;

var routes = (
  <Route path="/" handler={App}>
    <DefaultRoute name="home" handler={Home} />
    <Route name="about" handler={About} />
  </Route>
);

Router.run(routes, Router.HistoryLocation, function (Application) {
  React.render(<Application />, document.body);
});*/

React.render(<About />, document.body);

