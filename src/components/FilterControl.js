import {
  Button,
  ButtonGroup,
  Checkbox,
  Icon,
  Menu,
  MenuItem,
  NonIdealState,
  Radio,
  RadioGroup,
  Spinner,
} from '@blueprintjs/core';
import flowRight from 'lodash.flowright';
import {
  action,
  computed,
  decorate,
  extendObservable,
  flow,
  has,
  observable,
} from 'mobx';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { fromPromise } from 'mobx-utils';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import colors from '../utils/colors';

const ControlHeader = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;

const H3 = styled.h3`
  color: ${colors.solarGreen};
  margin: 0;
  font-size: 20px;
`;

const ControlBody = styled.div`
  min-width: 200px;
  max-height: 800px;
`;

const FilterList = styled.div`
  padding: 12px;
  min-height: 100px;
`;

const StyledNonIdealState = styled(NonIdealState)`
  & .pt-non-ideal-state-icon .pt-icon {
    color: ${colors.chromium};
  }

  & .pt-non-ideal-state-title {
    color: ${colors.chromium};
  }
`;

const TextHeader = styled.div`
  color: ${colors.chromium};
  margin-bottom: 12px;
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const StyledMenu = styled(Menu)`
  background: ${colors.mercury};
`;

function handleStringChange(handler) {
  return event => handler(event.target.value);
}

class AttributeValueList extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.string).isRequired,
    defaultCheckedValues: PropTypes.arrayOf(PropTypes.string),
    onChangeSelectedValues: PropTypes.func,
  };

  static defaultProps = {
    defaultCheckedValues: [],
    onChangeSelectedValues: null,
  };

  onValueChange = changedValue => {
    if (this.selectedValues.includes(changedValue)) {
      this.removeUnchekedValue(changedValue);
    } else {
      this.addCheckedValue(changedValue);
    }
    if (this.props.onChangeSelectedValues) {
      this.props.onChangeSelectedValues(this.selectedValues.slice());
    }
  };

  handleSearchChange = handleStringChange(searchValue => {
    this.searchValue = searchValue;
  });

  searchValue = '';

  selectedValues = this.props.defaultCheckedValues || [];

  addCheckedValue = value => {
    this.selectedValues = [...this.selectedValues, value];
  };

  removeUnchekedValue = value => {
    this.selectedValues = this.selectedValues.filter(i => i !== value);
  };

  render() {
    const { items } = this.props;
    const filteredItems = items.filter(
      i =>
        !this.searchValue ||
        i.toLowerCase().includes(this.searchValue.toLowerCase()),
    );
    return (
      <div>
        <InputGroup className="pt-input-group">
          <span className="pt-icon pt-icon-search" />
          <input
            className="pt-input"
            type="search"
            placeholder="Search Values"
            dir="auto"
            onChange={this.handleSearchChange}
          />
        </InputGroup>
        <StyledMenu>
          {filteredItems.length === 0 ? (
            <MenuItem disabled text="No Matches Found" />
          ) : (
            filteredItems.map(item => (
              <Checkbox
                defaultChecked={this.selectedValues.includes(item)}
                key={item}
                label={item}
                onChange={() => this.onValueChange(item)}
              />
            ))
          )}
        </StyledMenu>
      </div>
    );
  }
}

decorate(AttributeValueList, {
  addCheckedValue: action,
  handleSearchChange: action,
  removeUnchekedValue: action,
  searchValue: observable,
  selectedValues: observable.shallow,
});

const AttributeValueListWithStores = flowRight([inject('zoomdata'), observer])(
  AttributeValueList,
);

class IncludeExcludeAttributeValues extends Component {
  static propTypes = {
    attributeName: PropTypes.string.isRequired,
    label: PropTypes.string,
    zoomdata: PropTypes.shape({
      client: MobxPropTypes.objectOrObservableObject,
      filters: MobxPropTypes.arrayOrObservableArray,
      sources: MobxPropTypes.arrayOrObservableArray,
      charts: MobxPropTypes.arrayOrObservableArray,
    }).isRequired,
  };

  static defaultProps = {
    label: null,
  };

  constructor(props) {
    super(props);
    this.getAttributeValues();
    const { zoomdata } = this.props;
    const existingFilter = zoomdata.filters.find(
      filter => filter.path.name === this.props.attributeName,
    );
    this.selectedValues = (existingFilter && existingFilter.value) || [];
  }

  onOperationChange = handleStringChange(selectedOperation => {
    this.operation = selectedOperation;
  });

  getAttributeValues = () => {
    const { zoomdata, attributeName } = this.props;
    const { client } = zoomdata;
    const source = zoomdata.sources[0];
    const applicationPath = client.getHomePath();
    const { key } = client.getCredentials();
    const endpoint = `/service/sources/${
      source.id
    }/attributes/${attributeName}/values?key=${key}`;
    this.fetchAttributeValuesResult = fromPromise(
      fetch(applicationPath + endpoint)
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(`Network response was not ok.`);
        })
        .catch(err =>
          console.error(
            `There has been a problem with your fetch operation: `,
            err.mesage,
          ),
        ),
    );
  };

  handleApplyFilter = () => {
    const { attributeName, zoomdata } = this.props;
    const { visualizations } = zoomdata;
    visualizations.forEach(visualization => {
      const newFilter = {
        path: {
          name: attributeName,
        },
        operation: this.operation,
        value: this.selectedValues,
      };
      const currentFilters = visualization.query.getFilters();
      const indexOfFilter = currentFilters.findIndex(
        filter => filter.path.name === newFilter.path.name,
      );
      if (indexOfFilter >= 0) {
        visualization.query.changeFilter(
          currentFilters[indexOfFilter],
          newFilter,
        );
      } else {
        visualization.query.addFilters(newFilter);
      }

      setTimeout(
        // eslint-disable-next-line func-names
        flow(function*() {
          zoomdata.filters = yield visualization.query.getFilters();
        }),
        100,
      );
    });
  };

  handleChange = selectedValues => {
    this.selectedValues = selectedValues;
  };

  operation = `IN`;

  render() {
    const { attributeName, label } = this.props;
    return (
      <React.Fragment>
        <RadioGroup
          inline
          onChange={this.onOperationChange}
          selectedValue={this.operation}
        >
          <Radio label="Include" value="IN" />
          <Radio label="Exclude" value="NOTIN" />
        </RadioGroup>
        <TextHeader>{label || attributeName}</TextHeader>
        {this.fetchAttributeValuesResult.case({
          pending: () => (
            <Menu>
              <Spinner className="pt-small" />
              <span>Loading...</span>
            </Menu>
          ),
          rejected: error => <div>Ooops.. {error}</div>,
          fulfilled: value => (
            <AttributeValueListWithStores
              defaultCheckedValues={this.selectedValues.slice()}
              onChangeSelectedValues={this.handleChange}
              inputValue=""
              items={value}
            />
          ),
        })}
        <ButtonGroup className="pt-fill">
          <Button text="Cancel" />
          <Button
            disabled={this.selectedValues.length === 0}
            text="Apply"
            onClick={this.handleApplyFilter}
          />
        </ButtonGroup>
      </React.Fragment>
    );
  }
}

decorate(IncludeExcludeAttributeValues, {
  addCheckedValue: action,
  handleChange: action,
  removeUnchekedValue: action,
  onOperationChange: action,
  operation: observable,
  selectedValues: observable.shallow,
});

const IncludeExcludeAttributeValuesWithStores = flowRight([
  inject('zoomdata'),
  observer,
])(IncludeExcludeAttributeValues);

class FieldList extends Component {
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    onFieldSelect: PropTypes.func,
  };

  static defaultProps = {
    onFieldSelect: null,
  };

  searchValue = '';

  handleSearchChange = handleStringChange(searchValue => {
    this.searchValue = searchValue;
  });

  render() {
    const { items, onFieldSelect } = this.props;
    const filteredItems = items.filter(
      i =>
        !this.searchValue ||
        i
          .getName()
          .toLowerCase()
          .includes(this.searchValue.toLowerCase()),
    );
    return (
      <div>
        <InputGroup className="pt-input-group">
          <span className="pt-icon pt-icon-search" />
          <input
            className="pt-input"
            type="search"
            placeholder="Search Fields"
            dir="auto"
            onChange={this.handleSearchChange}
          />
        </InputGroup>
        <StyledMenu>
          {filteredItems.length === 0 ? (
            <MenuItem disabled text="No Matches Found" />
          ) : (
            filteredItems.map(item => (
              <MenuItem
                key={item.getName()}
                labelElement={<Icon icon="chevron-right" />}
                onClick={() => onFieldSelect(item)}
                text={item.getLabel()}
                shouldDismissPopover={false}
              />
            ))
          )}
        </StyledMenu>
      </div>
    );
  }
}

decorate(FieldList, {
  handleSearchChange: action,
  searchValue: observable,
});

const FieldListWithStores = flowRight([inject('zoomdata'), observer])(
  FieldList,
);

class AddFilter extends Component {
  static propTypes = {
    zoomdata: PropTypes.shape({
      client: MobxPropTypes.objectOrObservableObject,
      filters: MobxPropTypes.arrayOrObservableArray,
    }).isRequired,
  };

  constructor(props) {
    super(props);
    this.getFilterFields();
  }

  onFieldSelect = selectedField => {
    this.selectedField = selectedField;
  };

  get view() {
    return this.selectedField ? `FIELDVALUES` : `FIELDLIST`;
  }

  // eslint-disable-next-line func-names
  getFilterFields = flow(function*() {
    const { zoomdata } = this.props;
    const { client, sources } = zoomdata;
    let metaData;
    if (has(zoomdata, `metaThread`)) {
      metaData = zoomdata.metaThread.getLatestResponse();
    } else {
      const metaThread = yield client.createMetaThread();
      metaData = yield metaThread.requestMetaDataForSourceId(sources[0].id);
      extendObservable(zoomdata, { metaThread }, {}, { deep: false });
    }
    this.filterFields = metaData
      .getFields()
      .filter(
        field => !field.hasRawDataOnly() && field.getType() === `ATTRIBUTE`,
      );
  });

  selectedField = null;

  filterFields = [];

  render() {
    return this.view === `FIELDLIST` ? (
      <React.Fragment>
        <TextHeader>Add Filter</TextHeader>
        <FieldListWithStores
          items={this.filterFields.slice()}
          onFieldSelect={this.onFieldSelect}
        />
      </React.Fragment>
    ) : (
      <React.Fragment>
        <IncludeExcludeAttributeValuesWithStores
          attributeName={this.selectedField.getName()}
          label={this.selectedField.getLabel()}
        />
      </React.Fragment>
    );
  }
}

decorate(AddFilter, {
  filterFields: observable.shallow,
  onFieldSelect: action,
  selectedField: observable.ref,
  view: computed,
});

const AddFilterWithStores = flowRight([inject('zoomdata'), observer])(
  AddFilter,
);

class FilterPanel extends Component {
  static propTypes = {
    zoomdata: PropTypes.shape({
      filters: MobxPropTypes.arrayOrObservableArray,
    }).isRequired,
  };

  setView = view => {
    this.view = view;
  };

  view = 'FILTERLIST';

  render() {
    const { view } = this;
    const { zoomdata } = this.props;
    const { filters } = zoomdata;
    return view === 'FILTERLIST' ? (
      <React.Fragment>
        <Button
          text="Add Filter"
          icon="add"
          className="pt-small pt-intent-primary"
          onClick={() => this.setView(`ADDFILTER`)}
        />
        <FilterList>
          {filters.length === 0 ? (
            <StyledNonIdealState visual="filter" title="No filters applied" />
          ) : (
            <div>Yoooo</div>
          )}
        </FilterList>
      </React.Fragment>
    ) : (
      <AddFilterWithStores />
    );
  }
}

decorate(FilterPanel, {
  setView: action,
  view: observable,
});

const FilterPanelWithStores = flowRight([inject('zoomdata'), observer])(
  FilterPanel,
);

const FilterControl = () => (
  <React.Fragment>
    <ControlHeader>
      <H3>Active Filters</H3>
    </ControlHeader>
    <ControlBody>
      <FilterPanelWithStores />
    </ControlBody>
  </React.Fragment>
);

export default FilterControl;
