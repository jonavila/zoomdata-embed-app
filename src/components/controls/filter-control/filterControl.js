import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import { Body } from '../../popover/body';
import { Header } from '../../popover/header/header';
import { Content } from './content/content';

let FilterControl = ({ filterManager }) => (
  <React.Fragment>
    <Header title="Filters" />
    <Body>
      <Content filterManager={filterManager} />
    </Body>
  </React.Fragment>
);

FilterControl.propTypes = {
  filterManager: PropTypes.shape({
    client: PropTypes.shape({}).isRequired,
    filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    metaThread: PropTypes.shape({}).isRequired,
    source: PropTypes.shape({}).isRequired,
  }).isRequired,
};

FilterControl = observer(FilterControl);

export { FilterControl };
