import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import React from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';
import presets from '../../utils/presets';
import { Header } from './header/header';
import { Widget } from '../widget/widget';

const View = styled.main`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  position: relative;
  background-color: ${colors.ui.whisper};
  padding-top: ${presets.headerHeight}px;
`;

let Dashboard = () => (
  <View>
    <Header title="Embed Example" />
    <Widget chartName="Packed Bubbles" sourceName="Sales" />
  </View>
);

Dashboard = flowRight([observer])(Dashboard);

export { Dashboard };
