import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import colors from '../../utils/colors';
import { Body } from './body';
import { Header } from './header';

const View = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex-flow: column;
  flex: 1 1 auto;
  min-height: 100px;
  margin: 10px;
  background-color: #ffff;
  border: 1px solid ${colors.zoomdataGreen};
`;

let Widget = class Widget extends Component {
  static propTypes = {
    chartName: PropTypes.string.isRequired,
    client: PropTypes.shape({}).isRequired,
    onChartLoaded: PropTypes.func,
    source: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    onChartLoaded: null,
  };

  render() {
    const { chartName, client, onChartLoaded, source } = this.props;
    return (
      <View>
        <Header title={chartName} />
        <Body
          chartName={chartName}
          client={client}
          onChartLoaded={onChartLoaded}
          source={source}
        />
      </View>
    );
  }
};

Widget = flowRight([observer])(Widget);

export { Widget };
