/* eslint-disable react/prop-types */
import {
  Icon,
  InputGroup,
  Menu,
  MenuDivider,
  MenuItem,
  NonIdealState,
} from '@blueprintjs/core';
import groupBy from 'lodash.groupby';
import map from 'lodash.map';
import { action, decorate, observable } from 'mobx';
import { observer } from 'mobx-react';
import { PropTypes as MobxPropTypes } from 'mobx-react/index';
import { fromPromise } from 'mobx-utils';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { handleStringChange } from '../../../utils/inputUtils';
import { SpinnerWithText } from '../../spinner-with-text/spinnerWithText';
import { InListFilter } from './inListFilter';

let AddFilter = class AddFilter extends Component {
  static propTypes = {
    filterManager: PropTypes.shape({
      charts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      client: PropTypes.shape({}).isRequired,
      filters: PropTypes.oneOfType([MobxPropTypes.observableArray]).isRequired,
      metaThread: PropTypes.shape({}).isRequired,
      source: PropTypes.shape({}).isRequired,
    }).isRequired,
    onFilterAdd: PropTypes.func,
    filter: PropTypes.shape({}),
  };

  static defaultProps = {
    onFilterAdd: null,
    filter: null,
  };

  getFields = fromPromise(async (resolve, reject) => {
    const { filterManager } = this.props;
    const { metaThread, source } = filterManager;
    try {
      const metaData = await metaThread.requestMetaDataForSourceId(source.id);
      resolve(metaData.getFields().filter(field => !field.hasRawDataOnly()));
    } catch (err) {
      reject(`Error fetching fields`);
    }
  });

  setSearchInputValue = handleStringChange(value => {
    this.searchInputValue = value;
  });

  setSelectedField = field => {
    this.selectedField = field;
  };

  searchInputValue = ``;

  selectedField = (this.props.filter &&
    this.props.filterManager.metaThread
      .getLatestResponse()
      .getField(this.props.filter.path.name)) ||
    null;

  render() {
    return this.getFields.case({
      pending: () => (
        <Menu>
          <SpinnerWithText
            className="pt-small"
            inline
            text="Fetching fields..."
          />
        </Menu>
      ),
      rejected: error => (
        <Menu>
          <NonIdealState visual="error" description={error} />
        </Menu>
      ),
      fulfilled: fields => {
        const { filter, filterManager } = this.props;
        const { filters } = filterManager;
        let defaultChecked;
        let defaultOperation;
        if (filter) {
          defaultChecked = filter.value;
          defaultOperation = filter.operation;
        }

        const searchResults = fields
          .filter(field => {
            if (filters.length > 0) {
              return !filters.find(
                existingFilter => existingFilter.path.name === field.getName(),
              );
            }
            return true;
          })
          .filter(
            field =>
              !this.searchInputValue ||
              field
                .getName()
                .toLowerCase()
                .includes(this.searchInputValue.toLocaleLowerCase()),
          );
        const resultsByType = groupBy(searchResults, field => field.getType());

        return !this.selectedField ? (
          <React.Fragment>
            <InputGroup
              leftIcon="search"
              onChange={this.setSearchInputValue}
              placeholder="Search Fields"
            />
            <Menu>
              {searchResults.length === 0 ? (
                <NonIdealState title="No fields found" visual="zoom-out" />
              ) : (
                map(resultsByType, (resultFields, type) => (
                  <React.Fragment key={type}>
                    <MenuDivider key={type} title={type} />
                    {resultFields.map(field => (
                      <MenuItem
                        disabled={type !== `ATTRIBUTE`}
                        key={field.getName()}
                        labelElement={<Icon icon="chevron-right" />}
                        onClick={() => this.setSelectedField(field)}
                        shouldDismissPopover={false}
                        text={field.getLabel()}
                      />
                    ))}
                  </React.Fragment>
                ))
              )}
            </Menu>
          </React.Fragment>
        ) : (
          <InListFilter
            defaultChecked={defaultChecked}
            defaultOperation={defaultOperation}
            field={this.selectedField}
            filterManager={filterManager}
            onApplyFilter={this.props.onFilterAdd}
          />
        );
      },
    });
  }
};

decorate(AddFilter, {
  searchInputValue: observable,
  selectedField: observable.ref,
  setSearchInputValue: action,
  setSelectedField: action,
});

AddFilter = observer(AddFilter);

export { AddFilter };
