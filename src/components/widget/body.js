import flowRight from 'lodash.flowright';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { ZoomdataChart } from '../zoomdata-chart/zoomdataChart';

const View = styled.div`
  display: flex;
  flex: 1 1 auto;
  width: 100%;
  visibility: ${props => (props.show ? `visible` : `hidden`)};
`;

let Body = ({ widgetStore, source, chartName }) => (
  <View
    show={
      widgetStore.queryStatus === 'DATA' ||
      widgetStore.queryStatus === 'FINISHED'
    }
  >
    <ZoomdataChart source={source} chartName={chartName} />
  </View>
);

Body.propTypes = {
  widgetStore: PropTypes.shape({
    queryStatus: PropTypes.string,
    visualization: MobxPropTypes.objectOrObservableObject,
  }).isRequired,
  source: PropTypes.shape({}).isRequired,
  chartName: PropTypes.string.isRequired,
};

Body = flowRight([inject('widgetStore'), observer])(Body);

export { Body };
