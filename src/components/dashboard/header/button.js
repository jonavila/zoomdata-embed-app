import styled from 'styled-components';
import colors from '../../../utils/colors';
import { Button as CoreButton } from '../../button/button';

export const Button = styled(CoreButton)`
  &.pt-button.pt-minimal.pt-intent-primary {
    color: ${colors.chromium};
  }

  &.pt-button.pt-intent-primary {
    color: ${colors.chromium};
    background-color: ${colors.zoomdataBlue};
  }
`;
