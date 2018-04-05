import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import { NonIdealState } from '../../../../non-ideal-state/nonIdealState';

const View = styled.div`
  min-height: 100px;
`;

let FilterList = ({ filters }) => (
  <View>
    {filters.length > 0 ? null : (
      <NonIdealState title="No filters applied" visual="filter" />
    )}
  </View>
);

FilterList.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
};

FilterList = observer(FilterList);

export { FilterList };
