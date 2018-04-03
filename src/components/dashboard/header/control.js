import { Popover } from '@blueprintjs/core/';
import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react/index';
import PropTypes from 'prop-types';
import React from 'react';
import { Button } from './button';

let Control = ({ content, ...buttonProps }) => (
  <Popover popoverClassName="zd-popover" content={content}>
    <Button {...buttonProps} />
  </Popover>
);

Control.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
};

Control = flowRight([observer])(Control);

export { Control };
