import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';

const View = styled.div`
  display: flex;
  height: auto;
  width: 100%;
`;

let ZoomdataChart = class ZoomdataChart extends Component {
  static propTypes = {
    chartName: PropTypes.string.isRequired,
    client: PropTypes.shape({}).isRequired,
    onChartLoaded: PropTypes.func,
    onStatusChange: PropTypes.func,
    source: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    onChartLoaded: null,
    onStatusChange: null,
  };

  static getControlsCfg = source => {
    let { controlsCfg } = source;
    const playerControlCfg = controlsCfg && controlsCfg.playerControlCfg;
    if (!controlsCfg) {
      controlsCfg = {
        playerControlCfg: {},
        timeControlCfg: null,
      };
    }
    if (source.playbackMode) {
      controlsCfg.playerControlCfg = {
        pauseAfterRead: !source.live,
        timeWindowScale: playerControlCfg.timeWindowScale,
      };
      if (!source.live) {
        controlsCfg.playerControlCfg.stopTime = '$end_of_data';
      }
    }
    return controlsCfg;
  };

  static getVisVariables = (source, chartName) =>
    source.visualizations.filter(
      visualization => visualization.name === chartName,
    )[0].source.variables;

  componentDidMount() {
    this.loadChart();
  }

  onChartLoaded = visualization => {
    const { onChartLoaded, onStatusChange } = this.props;
    if (onStatusChange) {
      onStatusChange(`CHART_LOADED`);
    }
    if (onChartLoaded) {
      onChartLoaded(visualization);
    }
  };

  chartDiv = React.createRef();

  loadChart = async () => {
    const { chartName, client, onStatusChange, source } = this.props;
    const queryConfig = { filters: [] };
    const controlsCfg = ZoomdataChart.getControlsCfg(source);
    const visVariables = ZoomdataChart.getVisVariables(source, chartName);
    queryConfig.time = controlsCfg.timeControlCfg;
    queryConfig.player = controlsCfg.playerControlCfg;
    try {
      const visualization = await client.visualize({
        config: queryConfig,
        element: this.chartDiv.current,
        source,
        variables: visVariables,
        visualization: chartName,
      });

      if (visualization) {
        this.onChartLoaded(visualization);
      }

      const { thread } = visualization;
      thread.on('thread:start', () => onStatusChange(`QUERY_STARTING`));
      thread.on('thread:message', () => onStatusChange(`RECEIVING_DATA`));
      thread.on('thread:notDirtyData', () =>
        onStatusChange(`DATA_NOT_SAMPLED`),
      );
      thread.on('thread:noData', () => () => onStatusChange(`NO_DATA`));
    } catch (err) {
      console.error(err.message);
    }
  };

  render() {
    return <View innerRef={this.chartDiv} />;
  }
};

ZoomdataChart = flowRight([observer])(ZoomdataChart);

export { ZoomdataChart };
