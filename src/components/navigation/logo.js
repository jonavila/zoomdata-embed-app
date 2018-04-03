import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import presets from '../../utils/presets';

const View = styled.img`
  height: ${presets.headerHeight * 0.8}px;
`;

let Logo = ({ src }) => <View src={src} />;

Logo.propTypes = {
  src: PropTypes.string.isRequired,
};

Logo = flowRight([observer])(Logo);

export { Logo };
