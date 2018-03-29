import React from 'react';
import styled from 'styled-components';
import colors from '../utils/colors';
import presets from '../utils/presets';
import Masthead from './Masthead';
import WidgetContainer from './WidgetContainer';

const StyledMain = styled.main`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  position: relative;
  background-color: ${colors.ui.whisper};
  padding-top: ${presets.headerHeight}px;
`;
const Main = () => (
  <StyledMain>
    <Masthead />
    <WidgetContainer chartName="Packed Bubbles" sourceName="Sales" />
  </StyledMain>
);

export default Main;
