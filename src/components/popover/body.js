import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const View = styled.div`
  display: flex;
  flex-flow: column;
  min-width: 200px;
  max-width: 300px;
  padding: 5px;
`;

let Body = ({ children }) => <View>{children}</View>;

Body.propTypes = {
  children: PropTypes.node,
};

Body.defaultProps = {
  children: null,
};

Body = observer(Body);

export { Body };
