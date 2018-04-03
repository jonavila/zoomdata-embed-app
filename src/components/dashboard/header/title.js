import { EditableText } from '@blueprintjs/core';
import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import colors from '../../../utils/colors';

const View = styled.h1`
  color: ${colors.chromium};
  margin: 0;
  font-size: 24px;
`;

let Title = ({ value }) => (
  <View>
    <EditableText disabled value={value} />
  </View>
);

Title.propTypes = {
  value: PropTypes.string.isRequired,
};

Title = flowRight([observer])(Title);

export { Title };
