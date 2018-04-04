import flowRight from 'lodash.flowright';
import { action, decorate, observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';
import presets from '../../utils/presets';
import { Widget } from '../widget/widget';
import { Header } from './header/header';

const { $ } = window;

const View = styled.main`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  position: relative;
  background-color: ${colors.ui.whisper};
  padding-top: ${presets.headerHeight}px;
`;

let Dashboard = class Dashboard extends Component {
  static propTypes = {
    client: PropTypes.shape({}).isRequired,
  };

  constructor(props) {
    super(props);
    let timeoutId;

    window.onresize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(this.onWindowResize, 100);
    };
  }

  onChartLoaded = chart => {
    this.charts.push(chart);
  };

  onWindowResize = () => {
    this.charts.forEach(chart => {
      chart.resize(
        $(chart.element.parentNode).width(),
        $(chart.element.parentNode).height(),
      );
    });
  };

  charts = [];

  render() {
    const { client } = this.props;
    return (
      <View>
        <Header title="Embed Example" />
        <Widget
          chartName="Packed Bubbles"
          client={client}
          onChartLoaded={this.onChartLoaded}
          sourceName="Sales"
        />
      </View>
    );
  }
};

decorate(Dashboard, {
  charts: observable.shallow,
  onChartLoaded: action,
});

Dashboard = flowRight([observer])(Dashboard);

export { Dashboard };
