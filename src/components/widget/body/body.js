import convert from 'htmr';
import { action, computed, decorate, observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { ChartTooltip } from '../../chart-tooltip/chartTooltips';
import { SpinnerWithText } from '../../spinner-with-text/spinnerWithText';
import { ZoomdataChart } from './zoomdataChart';

const { $ } = window;

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

  onTooltipShow = options => {
    const { x, y } = options;
    this.tooltipShow = true;
    this.tooltipContent = $.parseHTML(options.content())[0].outerHTML;
    this.setTooltipCoordinates({ x, y });
  };

  onTooltipHide = () => {
    this.tooltipShow = false;
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

  setTooltipCoordinates = coordinates => {
    this.tooltipCoordinates = coordinates;
  };

  status = `CHART_LOADING`;

  tooltipContent = null;

  tooltipCoordinates = {
    x: 0,
    y: 0,
  };

  tooltipShow = false;

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
            onTooltipShow={this.onTooltipShow}
            onTooltipHide={this.onTooltipHide}
            source={source}
          />
          <ChartTooltip
            coordinates={this.tooltipCoordinates}
            show={this.tooltipShow}
          >
            {this.tooltipContent ? convert(this.tooltipContent) : <div />}
          </ChartTooltip>
        </View>
      </React.Fragment>
    );
  }
};

decorate(Body, {
  onStatusChange: action,
  onTooltipShow: action,
  onTooltipHide: action,
  status: observable,
  statusText: computed,
  setTooltipCoordinates: action,
  tooltipCoordinates: observable,
  tooltipShow: observable,
});

Body = observer(Body);

export { Body };
