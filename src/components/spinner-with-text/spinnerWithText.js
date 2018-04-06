import { Spinner } from '@blueprintjs/core';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/';

const View = styled.div`
  display: flex;
  flex-flow: column;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const InlineView = styled.div`
  display: flex;
  align-items: center;
`;

let SpinnerWithText = ({ inline, text, ...spinnerProps }) =>
  inline ? (
    <InlineView>
      <Spinner {...spinnerProps} />
      <span>{text}</span>
    </InlineView>
  ) : (
    <View>
      <Spinner {...spinnerProps} />
      <div>{text}</div>
    </View>
  );

SpinnerWithText.propTypes = {
  inline: PropTypes.bool,
  text: PropTypes.string.isRequired,
};

SpinnerWithText.defaultProps = {
  inline: false,
};

SpinnerWithText = observer(SpinnerWithText);

export { SpinnerWithText };
