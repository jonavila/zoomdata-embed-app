import { Button as BlueprintButton } from '@blueprintjs/core';
import styled from 'styled-components';
import colors from '../../../utils/colors';

export const Button = styled(BlueprintButton)`
  &.pt-button.pt-minimal.pt-intent-primary {
    color: ${colors.chromium};
  }

  &.pt-button.pt-intent-primary {
    color: ${colors.chromium};
    background-color: ${colors.zoomdataBlue};
  }
`;
