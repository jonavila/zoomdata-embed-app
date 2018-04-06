import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const View = styled.div`
  padding: 5px;
`;

let Footer = ({ children }) => <View>{children}</View>;

Footer.propTypes = {
  children: PropTypes.node,
};

Footer.defaultProps = {
  children: null,
};

Footer = observer(Footer);

export { Footer };
