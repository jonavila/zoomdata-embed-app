import { Button } from '@blueprintjs/core';
import styled from 'styled-components';
import colors from '../utils/colors';

export default styled(Button)`
  &.pt-button.pt-minimal.pt-intent-primary {
    color: ${colors.chromium};
  }

  &.pt-button.pt-intent-primary {
    color: ${colors.chromium};
    background-color: ${colors.zoomdataBlue};
  }
`;
