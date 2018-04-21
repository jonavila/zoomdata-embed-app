import { Card } from '@blueprintjs/core';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components/';

const View = styled.div`
  display: flex;
  flex-flow: wrap;
  padding: 20px;
`;

export let DashboardCards = ({ dashboards }) => (
  <View>
    {dashboards.map(dashboard => (
      <Card interactive key={dashboard.id}>
        <h5>{dashboard.name}</h5>
      </Card>
    ))}
  </View>
);

DashboardCards.propTypes = {
  dashboards: PropTypes.oneOfType([MobxPropTypes.observableArray]).isRequired,
};

DashboardCards = observer(DashboardCards);
