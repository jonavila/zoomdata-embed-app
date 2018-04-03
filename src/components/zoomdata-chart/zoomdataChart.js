import flowRight from 'lodash.flowright';
import { action, decorate, extendObservable, observable } from 'mobx';
import { inject, PropTypes as MobxPropTypes, observer } from 'mobx-react';
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
    widgetStore: PropTypes.shape({
      queryStatus: PropTypes.string,
      visualization: MobxPropTypes.objectOrObservableObject,
    }).isRequired,
    zoomdata: PropTypes.shape({
      client: MobxPropTypes.objectOrObservableObject,
      visualizations: MobxPropTypes.arrayOrObservableArray,
    }).isRequired,
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

  onQueryStart = () => {
    const { widgetStore } = this.props;
    if (widgetStore) {
      widgetStore.queryStatus = 'STARTED';
    }
  };

  onReceivingData = () => {
    const { widgetStore } = this.props;
    if (widgetStore) {
      widgetStore.queryStatus = 'DATA';
    }
  };

  onQueryComplete = () => {
    const { widgetStore } = this.props;
    if (widgetStore) {
      widgetStore.queryStatus = 'FINISHED';
    }
  };

  loadChart = async () => {
    const { zoomdata, widgetStore, source, chartName } = this.props;
    if (zoomdata) {
      const queryConfig = { filters: [] };
      const controlsCfg = ZoomdataChart.getControlsCfg(source);
      const visVariables = ZoomdataChart.getVisVariables(source, chartName);
      queryConfig.time = controlsCfg.timeControlCfg;
      queryConfig.player = controlsCfg.playerControlCfg;
      try {
        const visualization = await zoomdata.client.visualize({
          config: queryConfig,
          element: this.node,
          source,
          variables: visVariables,
          visualization: chartName,
        });
        extendObservable(
          widgetStore,
          { visualization },
          { visualization: observable.ref },
        );

        zoomdata.visualizations.push(visualization);
        visualization.thread.on('thread:start', () => this.onQueryStart());
        visualization.thread.on('thread:message', () => this.onReceivingData());
        visualization.thread.on('thread:notDirtyData', () =>
          this.onQueryComplete(),
        );
        visualization.thread.on('thread:noData', () => this.onQueryComplete());
      } catch (err) {
        console.error(err.message);
      }
    }
  };

  render() {
    const { widgetStore } = this.props;
    return (
      <View
        show={
          widgetStore.queryStatus === 'DATA' ||
          widgetStore.queryStatus === 'FINISHED'
        }
        innerRef={node => {
          this.node = node;
        }}
      />
    );
  }
};

decorate(ZoomdataChart, {
  onQueryStart: action,
  onReceivingData: action,
  onQueryComplete: action,
});

ZoomdataChart = flowRight([inject('widgetStore', 'zoomdata'), observer])(
  ZoomdataChart,
);

export { ZoomdataChart };
