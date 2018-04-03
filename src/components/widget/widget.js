import flowRight from 'lodash.flowright';
import { decorate, flow, has, observable } from 'mobx';
import {
  inject,
  observer,
  PropTypes as MobxPropTypes,
  Provider,
} from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
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

let Widget = ({ zoomdata, sourceName, chartName }) => {
  if (has(zoomdata, `client`)) {
    const widgetSource = zoomdata.sources.find(
      source => source.name === sourceName,
    );
    if (!widgetSource) {
      // eslint-disable-next-line func-names
      flow(function*() {
        try {
          yield zoomdata.client.sources.update({ name: sourceName });
          zoomdata.sources = zoomdata.client.sources.get();
        } catch (err) {
          console.error(err.message);
        }
      })();
      return (
        <View>
          <Spinner text="Fetching source..." />
        </View>
      );
    }
    const source = zoomdata.client.sources.get({ name: sourceName })[0];
    return (
      <Provider widgetStore={widgetStore}>
        <View>
          {widgetStore.queryStatus === 'NONE' ||
          widgetStore.queryStatus === 'STARTED' ? (
            <Spinner
              text={
                widgetStore.queryStatus === `STARTED`
                  ? `Running query...`
                  : `Loading chart...`
              }
            />
          ) : null}
          <Header title={chartName} />
          <Body source={source} chartName={chartName} />
        </View>
      </Provider>
    );
  }
  return (
    <View>
      <Spinner text="Waiting for Zoomdata client..." />
    </View>
  );
};

Widget.propTypes = {
  zoomdata: PropTypes.shape({
    client: MobxPropTypes.objectOrObservableObject,
    sources: MobxPropTypes.arrayOrObservableArray,
  }).isRequired,
  sourceName: PropTypes.string.isRequired,
  chartName: PropTypes.string.isRequired,
};

Widget = flowRight([inject('zoomdata'), observer])(Widget);

export { Widget };
