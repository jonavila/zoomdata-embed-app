import { Spinner } from '@blueprintjs/core';
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
import colors from '../utils/colors';
import WidgetBody from './WidgetBody';

const widgetStore = {
  queryStatus: 'NONE',
};

decorate(widgetStore, {
  queryStatus: observable,
});

const StyledWidgetContainer = styled.div`
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

const WidgetSpinner = styled.div`
  display: ${props => (props.show ? `flex` : `none`)};
  flex-flow: column;
  align-items: center;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);

  && .pt-spinner-head {
    stroke: ${colors.zoomdataBlue};
  }
`;

const WidgetHeader = styled.div`
  display: flex;
  align-items: center;
  flex: auto;
  width: 100%;
  max-height: 24px;
  padding: 0 5px;

  &:hover {
    background-color: ${colors.chromium};
  }
`;

const WidgetContainer = ({ zoomdata, sourceName, chartName }) => {
  if (has(zoomdata, `client`)) {
    const widgetSource = zoomdata.sources.find(
      source => source.name === sourceName,
    );
    if (!widgetSource) {
      flow(function* fetchSource() {
        try {
          yield zoomdata.client.sources.update({ name: sourceName });
          zoomdata.sources = zoomdata.client.sources.get();
        } catch (err) {
          console.error(err.message);
        }
      })();
      return (
        <StyledWidgetContainer>
          <WidgetSpinner show>
            <Spinner className="pt-large" />
            <div>Fetching source...</div>
          </WidgetSpinner>
        </StyledWidgetContainer>
      );
    }
    const source = zoomdata.client.sources.get({ name: sourceName })[0];
    return (
      <Provider widgetStore={widgetStore}>
        <StyledWidgetContainer>
          <WidgetSpinner
            show={
              widgetStore.queryStatus === 'NONE' ||
              widgetStore.queryStatus === 'STARTED'
            }
          >
            <Spinner className="pt-large" />
            <div>
              {widgetStore.queryStatus === `STARTED`
                ? `Running query...`
                : `Loading chart...`}...
            </div>
          </WidgetSpinner>
          <WidgetHeader>
            <div>{chartName}</div>
          </WidgetHeader>
          <WidgetBody source={source} chartName={chartName} />
        </StyledWidgetContainer>
      </Provider>
    );
  }
  return (
    <StyledWidgetContainer>
      <WidgetSpinner show>
        <Spinner className="pt-large" />
        <div>Waiting for Zoomdata Client...</div>
      </WidgetSpinner>
    </StyledWidgetContainer>
  );
};

WidgetContainer.propTypes = {
  zoomdata: PropTypes.shape({
    client: MobxPropTypes.objectOrObservableObject,
    sources: MobxPropTypes.arrayOrObservableArray,
  }).isRequired,
  sourceName: PropTypes.string.isRequired,
  chartName: PropTypes.string.isRequired,
};

export default flowRight([inject('zoomdata'), observer])(WidgetContainer);
