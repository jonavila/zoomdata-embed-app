const { compose } = require('react-app-rewired');
const rewireMobX = require('react-app-rewire-mobx');
const rewireStyledComponents = require('react-app-rewire-styled-components');

module.exports = compose(rewireStyledComponents, rewireMobX);
