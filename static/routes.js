/* eslint react/no-multi-comp: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import DevTools from './devtools/index';

const NoMatch = () => <div>404</div>;

class App extends Component {
  componentWillMount() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.setState({
      gridX: parseInt(
        window.getComputedStyle(document.body, null).getPropertyValue('font-size'),
        10,
      ),
      gridY: parseInt(
        window.getComputedStyle(document.body, null).getPropertyValue('line-height'),
        10,
      ),
      viewport: [window.innerWidth, window.innerHeight],
    });
    const children = this.props.children;
    if (children && children.onResize) {
      children.onResize(this.state);
    }
  }

  render() {
    return React.cloneElement(this.props.children, this.state);
  }
}

App.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={App}>
          <IndexRoute component={DevTools} />
        </Route>
        <Route path='*' component={NoMatch} />
      </Router>
    );
  }
}
