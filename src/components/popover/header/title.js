import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import colors from '../../../utils/colors';

const View = styled.h3`
  color: ${colors.solarGreen};
  margin: 0;
  font-size: 20px;
`;

let Title = ({ text }) => <View>{text}</View>;

Title.propTypes = {
  text: PropTypes.string.isRequired,
};

Title = observer(Title);

export { Title };
