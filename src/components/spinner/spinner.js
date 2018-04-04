import { Spinner as BlueprintSpinner } from '@blueprintjs/core';
import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/';
import colors from '../../utils/colors';

const View = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  && .pt-spinner-head {
    stroke: ${colors.zoomdataBlue};
  }
`;

let Spinner = ({ text }) => (
  <View>
    <BlueprintSpinner className="pt-large" />
    <div>{text}</div>
  </View>
);

Spinner.propTypes = {
  text: PropTypes.string.isRequired,
};

Spinner = flowRight([observer])(Spinner);

export { Spinner };
