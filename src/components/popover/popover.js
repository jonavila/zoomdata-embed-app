import { Popover as BlueprintPopover } from '@blueprintjs/core/';
import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';

let Popover = ({ content, target, ...otherProps }) => (
  <BlueprintPopover
    content={content}
    popoverClassName="zd-popover"
    target={target}
    {...otherProps}
  />
);

Popover.propTypes = {
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired,
  target: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
};

Popover = flowRight([observer])(Popover);

export { Popover };
