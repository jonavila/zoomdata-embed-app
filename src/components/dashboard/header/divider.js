import { NavbarDivider } from '@blueprintjs/core';
import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';
import colors from '../../../utils/colors';

const View = styled(NavbarDivider)`
  background-color: ${colors.chromium};
`;

let Divider = () => <View />;

Divider = flowRight([observer])(Divider);

export { Divider };
