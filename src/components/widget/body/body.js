import { action, computed, decorate, observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { SpinnerWithText } from '../../spinner-with-text/spinnerWithText';
import { ZoomdataChart } from './zoomdataChart';

const View = styled.div`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  visibility: visible;
`;

let Body = class Body extends Component {
  static propTypes = {
    chartName: PropTypes.string.isRequired,
    client: PropTypes.shape({}).isRequired,
    onChartLoaded: PropTypes.func,
    source: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    onChartLoaded: null,
  };

  onStatusChange = status => {
    this.status = status;
  };

  get statusText() {
    const { chartName } = this.props;
    switch (this.status) {
      case `CHART_LOADING`:
      case `CHART_LOADED`:
        return `Loading Chart: ${chartName}`;
      case `QUERY_STARTING`:
        return `Running Query...`;
      default:
        return ``;
    }
  }

  status = `CHART_LOADING`;

  render() {
    const { chartName, client, onChartLoaded, source } = this.props;
    return (
      <React.Fragment>
        {this.statusText !== `` ? (
          <SpinnerWithText className="pt-large" text={this.statusText} />
        ) : null}
        <View>
          <ZoomdataChart
            chartName={chartName}
            client={client}
            onChartLoaded={onChartLoaded}
            onStatusChange={this.onStatusChange}
            source={source}
          />
        </View>
      </React.Fragment>
    );
  }
};

decorate(Body, {
  onStatusChange: action,
  status: observable,
  statusText: computed,
});

Body = observer(Body);

export { Body };
