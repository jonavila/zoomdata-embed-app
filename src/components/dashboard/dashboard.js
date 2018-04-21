import { action, computed, decorate, flow, observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';
import { navigationHeight } from '../../utils/presets';
import { SpinnerWithText } from '../spinner-with-text/spinnerWithText';
import { Widget } from '../widget/widget';
import { Header } from './header/header';

const { $ } = window;

const View = styled.main`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  position: relative;
  background-color: ${colors.ui.whisper};
  margin-top: ${navigationHeight}px;
`;

let Dashboard = class Dashboard extends Component {
  static propTypes = {
    client: PropTypes.shape({}).isRequired,
  };

  constructor(props) {
    super(props);
    const sourceNames = ['Sales'];
    this.getMetaThread();
    this.getSources(sourceNames);

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

  get isSingleSource() {
    return this.sourcesMap.size === 1;
  }

  get filterManager() {
    if (this.isSingleSource) {
      const { client } = this.props;
      return {
        charts: this.charts,
        client,
        filters: this.filters,
        metaThread: this.metaThread,
        source: this.sourcesMap.values().next().value,
      };
    }
    return null;
  }

  get sources() {
    return Array.from(this.sourcesMap.values());
  }

  get sourcesLoaded() {
    return this.sourcesMap.size > 0;
  }

  // eslint-disable-next-line func-names
  getMetaThread = flow(function*() {
    try {
      const { client } = this.props;
      this.metaThread = yield client.createMetaThread();
    } catch (err) {
      console.error(err);
    }
  });

  // eslint-disable-next-line func-names
  getSources = flow(function*(sourceNames) {
    try {
      const { client } = this.props;
      const sources = yield Promise.all(
        sourceNames.map(sourceName =>
          client.sources.update({ name: sourceName }).then(source => source[0]),
        ),
      );

      sources.forEach(
        source =>
          !this.sourcesMap.has(source.id)
            ? this.sourcesMap.set(source.id, source)
            : null,
      );
    } catch (err) {
      console.error(err);
    }
  });

  getSourceByName = name => this.sources.find(source => source.name === name);

  charts = [];

  filters = [];

  metaThread = null;

  sourcesMap = new Map();

  render() {
    const { client } = this.props;
    return this.sourcesLoaded ? (
      <View>
        <Header filterManager={this.filterManager} title="Embed Example" />
        {this.getSourceByName(`Sales`) ? (
          <Widget
            chartName="Packed Bubbles"
            client={client}
            onChartLoaded={this.onChartLoaded}
            source={this.getSourceByName(`Sales`)}
          />
        ) : null}
      </View>
    ) : (
      <SpinnerWithText className="pt-large" text="Fetching sources..." />
    );
  }
};

decorate(Dashboard, {
  charts: observable.ref,
  filters: observable.shallow,
  filterManager: computed.struct,
  metaThread: observable.ref,
  sourcesMap: observable.shallow,
  onChartLoaded: action,
});

Dashboard = observer(Dashboard);

export { Dashboard };
