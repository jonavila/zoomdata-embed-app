import flowRight from 'lodash.flowright';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';

const View = styled.div`
  min-width: 200px;
  max-height: 800px;
`;

let Body = ({ children }) => <View>{children}</View>;

Body.propTypes = {
  children: PropTypes.node,
};

Body.defaultProps = {
  children: null,
};

Body = flowRight([observer])(Body);

export { Body };
