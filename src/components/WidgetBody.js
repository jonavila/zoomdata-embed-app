import flowRight from 'lodash.flowright';
import { action, decorate, extendObservable, observable } from 'mobx';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { getControlsCfg, getVisVariables } from '../stores/Zoomdata';

const StyledWidgetBody = styled.div`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  visibility: ${props => (props.show ? `visible` : `hidden`)};
`;

const StyledWidget = styled.div`
  display: flex;
  height: auto;
  width: 100%;
`;

class Widget extends Component {
  static propTypes = {
    widgetStore: PropTypes.shape({
      queryStatus: PropTypes.string,
      visualization: MobxPropTypes.objectOrObservableObject,
    }).isRequired,
  };

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
      const controlsCfg = getControlsCfg(source);
      const visVariables = getVisVariables(source, chartName);
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
      <StyledWidget
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
}

decorate(Widget, {
  onQueryStart: action,
  onReceivingData: action,
  onQueryComplete: action,
});

const WidgetWithStores = flowRight([
  inject('widgetStore', 'zoomdata'),
  observer,
])(Widget);

const WidgetBody = ({ widgetStore, source, chartName }) => (
  <StyledWidgetBody
    show={
      widgetStore.queryStatus === 'DATA' ||
      widgetStore.queryStatus === 'FINISHED'
    }
  >
    <WidgetWithStores source={source} chartName={chartName} />
  </StyledWidgetBody>
);

WidgetBody.propTypes = {
  widgetStore: PropTypes.shape({
    queryStatus: PropTypes.string,
    visualization: MobxPropTypes.objectOrObservableObject,
  }).isRequired,
  source: PropTypes.shape({}).isRequired,
  chartName: PropTypes.string.isRequired,
};

export default flowRight([inject('widgetStore'), observer])(WidgetBody);
