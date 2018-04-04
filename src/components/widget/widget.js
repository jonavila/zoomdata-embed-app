import flowRight from 'lodash.flowright';
import { decorate, flow, observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';
import { Spinner } from '../spinner/spinner';
import { Body } from './body';
import { Header } from './header';

const widgetStore = {
  queryStatus: 'NONE',
};

decorate(widgetStore, {
  queryStatus: observable,
});

const View = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-flow: column;
  flex: 1 1 auto;
  min-height: 400px;
  margin: 10px;
  background-color: #ffff;
  border: 1px solid ${colors.zoomdataGreen};
`;

let Widget = class Widget extends Component {
  static propTypes = {
    chartName: PropTypes.string.isRequired,
    client: PropTypes.shape({}).isRequired,
    onChartLoaded: PropTypes.func,
    sourceName: PropTypes.string.isRequired,
  };

  static defaultProps = {
    onChartLoaded: null,
  };

  constructor(props) {
    super(props);
    this.getSource();
  }

  // eslint-disable-next-line func-names
  getSource = flow(function*() {
    try {
      const { client, sourceName } = this.props;
      yield client.sources.update({ name: sourceName });
      this.source = client.sources.get({ name: sourceName })[0];
      return this.source;
    } catch (err) {
      return err;
    }
  });

  source = null;

  render() {
    const { chartName, client, onChartLoaded, sourceName } = this.props;
    return this.source ? (
      <View>
        <Header title={chartName} />
        <Body
          chartName={chartName}
          client={client}
          onChartLoaded={onChartLoaded}
          source={this.source}
        />
      </View>
    ) : (
      <Spinner text={`Fetching source: ${sourceName}`} />
    );
  }
};

decorate(Widget, {
  source: observable.ref,
});

Widget = flowRight([observer])(Widget);

export { Widget };
