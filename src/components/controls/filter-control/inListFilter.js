import {
  Button,
  ButtonGroup,
  Checkbox,
  InputGroup,
  Menu,
  MenuDivider,
  NonIdealState,
  Radio,
  RadioGroup,
} from '@blueprintjs/core';
import isEqual from 'lodash.isequal';
import { action, decorate, observable } from 'mobx';
import { observer } from 'mobx-react';
import { PropTypes as MobxPropTypes } from 'mobx-react/index';
import { fromPromise } from 'mobx-utils';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import {
  handleBooleanChange,
  handleStringChange,
} from '../../../utils/inputUtils';
import { SpinnerWithText } from '../../spinner-with-text/spinnerWithText';

const Section = styled.div`
  display: flex;
  flex-flow: column;
  padding-bottom: 5px;
  overflow-y: auto;

  & .pt-menu {
    overflow-y: auto;
  }
`;

const Footer = styled.div`
  padding: 5px;
`;

const RadioGroupedStyled = styled(RadioGroup)`
  display: flex;
  justify-content: space-around;
  flex: 0 0 auto;
  align-items: center;
`;

let InListFilter = class InListFilter extends Component {
  static propTypes = {
    defaultChecked: PropTypes.arrayOf(PropTypes.string),
    defaultOperation: PropTypes.string,
    field: PropTypes.shape({
      getName: PropTypes.func,
      getLabel: PropTypes.func,
    }).isRequired,
    filterManager: PropTypes.shape({
      charts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      client: PropTypes.shape({}).isRequired,
      filters: PropTypes.oneOfType([MobxPropTypes.observableArray]).isRequired,
      metaThread: PropTypes.shape({}).isRequired,
      source: PropTypes.shape({}).isRequired,
    }).isRequired,
    onApplyFilter: PropTypes.func,
  };

  static defaultProps = {
    defaultChecked: [],
    defaultOperation: `IN`,
    onApplyFilter: null,
  };

  onApplyClick = () => {
    const {
      field,
      filterManager: { charts, filters },
      onApplyFilter,
    } = this.props;
    if (onApplyFilter) {
      onApplyFilter();
    }
    const newFilter = {
      path: {
        name: field.getName(),
        label: field.getLabel(),
      },
      operation: this.operation,
      value: this.checkedValues.slice(),
    };
    charts.forEach(chart => {
      const currentFilters = chart.query.getFilters();
      const indexOfFilter = currentFilters.findIndex(
        filter => filter.path.name === newFilter.path.name,
      );
      if (indexOfFilter >= 0) {
        chart.query.changeFilter(currentFilters[indexOfFilter], newFilter);
      } else {
        chart.query.addFilters(newFilter);
      }
    });

    const existingFilterIndex = filters.findIndex(
      filter => filter.path.name === newFilter.path.name,
    );

    if (existingFilterIndex === -1) {
      filters.push(newFilter);
    } else {
      filters[existingFilterIndex] = newFilter;
    }
  };

  onCancelClick = () => {
    const { defaultChecked } = this.props;
    this.isSelectAllChecked = false;
    this.checkedValues = defaultChecked;
  };

  onOperationChange = handleStringChange(selectedOperation => {
    this.operation = selectedOperation;
  });

  onSelectAllChecked = (checked, values) => {
    this.isSelectAllChecked = checked;
    if (checked) {
      this.checkedValues = values;
    } else {
      this.checkedValues = [];
    }
  };

  onValueChecked = value => {
    if (this.checkedValues.includes(value)) {
      this.removeUnchekedValue(value);
    } else {
      this.addCheckedValue(value);
    }
  };

  getValues = fromPromise((resolve, reject) => {
    const {
      field,
      filterManager: { client, source },
    } = this.props;
    const applicationPath = client.getHomePath();
    const { key } = client.getCredentials();
    const endpoint = `/service/sources/${
      source.id
    }/attributes/${field.getName()}/values?key=${key}`;
    return fetch(applicationPath + endpoint)
      .then(response => {
        if (response.ok) {
          resolve(response.json());
        }
        reject(`Network response was not ok.`);
      })
      .catch(() =>
        reject(`There has been a problem with your fetch operation`),
      );
  });

  setSearchInputValue = handleStringChange(value => {
    this.searchInputValue = value;
  });

  addCheckedValue = value => {
    this.checkedValues = [...this.checkedValues, value];
  };

  removeUnchekedValue = value => {
    this.checkedValues = this.checkedValues.filter(i => i !== value);
  };

  checkedValues = this.props.defaultChecked || [];

  operation = this.props.defaultOperation || `IN`;

  searchInputValue = ``;

  isSelectAllChecked = false;

  render() {
    return this.getValues.case({
      pending: () => (
        <Menu>
          <SpinnerWithText
            className="pt-small"
            inline
            text="Fetching values..."
          />
        </Menu>
      ),
      rejected: error => (
        <Menu>
          <NonIdealState visual="error" description={error} />
        </Menu>
      ),
      fulfilled: values => {
        const { field, defaultChecked } = this.props;
        const searchResults = values.filter(
          value =>
            !this.searchInputValue ||
            value
              .toLowerCase()
              .includes(this.searchInputValue.toLocaleLowerCase()),
        );

        return (
          <React.Fragment>
            <RadioGroupedStyled
              onChange={this.onOperationChange}
              selectedValue={this.operation}
            >
              <Radio label="Include" value="IN" />
              <Radio label="Exclude" value="NOTIN" />
            </RadioGroupedStyled>
            <InputGroup
              leftIcon="search"
              onChange={this.setSearchInputValue}
              placeholder="Search Values"
            />
            <Section>
              <Menu>
                <MenuDivider title={field.getLabel()} />
                {searchResults.length === 0 ? (
                  <NonIdealState title="No values found" visual="zoom-out" />
                ) : (
                  <React.Fragment>
                    <Checkbox
                      checked={this.isSelectAllChecked}
                      label="Select All"
                      onChange={handleBooleanChange(checked =>
                        this.onSelectAllChecked(checked, searchResults),
                      )}
                    />
                    {searchResults.map(value => (
                      <Checkbox
                        checked={this.checkedValues.includes(value)}
                        key={value}
                        label={value}
                        onChange={() => this.onValueChecked(value)}
                      />
                    ))}
                  </React.Fragment>
                )}
              </Menu>
            </Section>
            <Footer>
              {!isEqual(
                this.checkedValues.slice().sort(),
                defaultChecked.slice().sort(),
              ) ||
              (this.checkedValues.length > 0 &&
                this.operation !== this.props.defaultOperation) ? (
                // eslint-disable-next-line react/jsx-indent
                <ButtonGroup className="pt-fill">
                  <Button
                    className="pt-intent-primary"
                    onClick={this.onApplyClick}
                    text="Apply"
                  />
                  <Button onClick={this.onCancelClick} text="Cancel" />
                </ButtonGroup>
              ) : null}
            </Footer>
          </React.Fragment>
        );
      },
    });
  }
};

decorate(InListFilter, {
  addCheckedValue: action,
  checkedValues: observable.shallow,
  onApplyClick: action,
  onCancelClick: action,
  onOperationChange: action,
  onSelectAllChecked: action,
  operation: observable,
  removeUnchekedValue: action,
  searchInputValue: observable,
  isSelectAllChecked: observable,
  setSearchInputValue: action,
});

InListFilter = observer(InListFilter);

export { InListFilter };
