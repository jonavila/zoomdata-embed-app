import { action, decorate, observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button } from '../../../button/button';
import { AddFilter } from './add-filter/addFilter';
import { FilterList } from './filter-list/filterList';

let Content = class Content extends Component {
  static propTypes = {
    filterManager: PropTypes.shape({
      client: PropTypes.shape({}).isRequired,
      filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      metaThread: PropTypes.shape({}).isRequired,
      source: PropTypes.shape({}).isRequired,
    }).isRequired,
  };

  setView = view => {
    this.view = view;
  };

  view = `FILTERLIST`;

  render() {
    const { filterManager } = this.props;
    const { filters } = filterManager;
    return this.view === `FILTERLIST` ? (
      <React.Fragment>
        <Button
          className="pt-small pt-intent-primary"
          icon="add"
          onClick={() => this.setView(`ADDFILTER`)}
          text="Add Filter"
        />
        <FilterList filters={filters} />
      </React.Fragment>
    ) : (
      <AddFilter filterManager={filterManager} />
    );
  }
};

decorate(Content, {
  setView: action,
  view: observable,
});

Content = observer(Content);

export { Content };
