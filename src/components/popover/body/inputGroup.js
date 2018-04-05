import { InputGroup as BlueprintInputGroup } from '@blueprintjs/core';
import { observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components/';

const View = styled(BlueprintInputGroup)`
  margin-bottom: 15px;
`;

let InputGroup = ({ ...props }) => <View {...props} />;

InputGroup = observer(InputGroup);

export { InputGroup };
