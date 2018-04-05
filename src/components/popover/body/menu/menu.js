import { Menu as BlueprintMenu } from '@blueprintjs/core';
import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';

const View = styled(BlueprintMenu)`
  background: transparent;
`;

let Menu = ({ ...props }) => <View {...props} />;

Menu = flowRight([observer])(Menu);

export { Menu };
