import { Button as BlueprintButton } from '@blueprintjs/core';
import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';

const View = styled(BlueprintButton)`
  &.pt-button.pt-intent-primary {
    background-color: ${colors.zoomdataBlue};
  }
`;

let Button = ({ ...props }) => <View {...props} />;

Button = flowRight([observer])(Button);

export { Button };
