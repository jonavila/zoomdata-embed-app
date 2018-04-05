import { action, computed, decorate, flow, observable } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { FieldList } from './fieldlist';

let AddFilter = class AddFilter extends Component {
  static propTypes = {
    filterManager: PropTypes.shape({
      client: PropTypes.shape({}).isRequired,
      filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      metaThread: PropTypes.shape({}).isRequired,
      source: PropTypes.shape({}).isRequired,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.getFields();
  }

  get view() {
    return this.selectedField ? `FIELDVALUES` : `FIELDLIST`;
  }

  // eslint-disable-next-line func-names
  getFields = flow(function*() {
    const { filterManager } = this.props;
    const { metaThread, source } = filterManager;
    const metaData = yield metaThread.requestMetaDataForSourceId(source.id);

    this.fields = metaData
      .getFields()
      .filter(
        field => !field.hasRawDataOnly() && field.getType() === `ATTRIBUTE`,
      );
  });

  selectedField = null;

  render() {
    return this.view === `FIELDLIST` ? (
      <FieldList />
    ) : (
      <React.Fragment>
        <div>Attribute Values</div>
      </React.Fragment>
    );
  }
};

decorate(AddFilter, {
  fields: observable.shallow,
  selectedField: observable.ref,
  setSelectedField: action,
  view: computed,
});

AddFilter = observer(AddFilter);

export { AddFilter };
