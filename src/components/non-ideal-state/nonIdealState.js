import { NonIdealState as BlueprintNonIdealState } from '@blueprintjs/core';
import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';

const View = styled(BlueprintNonIdealState)`
  margin-top: 10px;
  & .pt-non-ideal-state-icon .pt-icon {
    color: ${colors.chromium};
  }

  & .pt-non-ideal-state-title {
    color: ${colors.chromium};
  }
`;

let NonIdealState = ({ ...props }) => <View {...props} />;

NonIdealState = flowRight([observer])(NonIdealState);

export { NonIdealState };
