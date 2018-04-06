import {
  Button,
  Icon,
  Menu,
  ControlGroup,
  MenuItem,
  MenuDivider,
  NonIdealState,
} from '@blueprintjs/core';
import { action, decorate, observable } from 'mobx';
import { observer } from 'mobx-react';
import { PropTypes as MobxPropTypes } from 'mobx-react/index';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { Body } from '../../popover/body';
import { Header } from '../../popover/header/header';
import { AddFilter } from './addFilter';

const Section = styled.div`
  display: flex;
  flex-flow: column;
  overflow-y: auto;

  & .pt-menu {
    overflow-y: auto;
  }
`;

const SectionHeader = styled.div`
  padding: 0 5px 5px;
`;

const FilterValues = styled.div`
  font-size: 12px;
  /* hide text if it more than N lines  */
  overflow: hidden;
  /* for set '...' in absolute position */
  position: relative;
  /* use this value to count block height */
  line-height: 1.2em;
  /* max-height = line-height (1.2) * lines max number (3) */
  max-height: 2.4em;
  /* fix problem when last visible word doesn't adjoin right side  */
  text-align: justify;
  /* place for '...' */
  padding-right: 1em;

  &::before {
    /* points in the end */
    content: '...';
    /* absolute position */
    position: absolute;
    /* set position to right bottom corner of block */
    right: 0;
    bottom: 0;
  }

  &::after {
    /* points in the end */
    content: '';
    /* absolute position */
    position: absolute;
    /* set position to right bottom corner of text */
    right: 0;
    /* set width and height */
    width: 1em;
    height: 1em;
    margin-top: 0.2em;
    /* bg color = bg color under block */
    background: #30404d;
  }
`;

let FilterControl = class FilterControl extends Component {
  static propTypes = {
    filterManager: PropTypes.shape({
      charts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
      client: PropTypes.shape({}).isRequired,
      filters: PropTypes.oneOfType([MobxPropTypes.observableArray]).isRequired,
      metaThread: PropTypes.shape({}).isRequired,
      source: PropTypes.shape({}).isRequired,
    }).isRequired,
  };

  onFilterClick = filter => {
    this.selectedFilter = filter;
    this.view = `ADDFILTER`;
  };

  onFilterRemove = filter => {
    const { filterManager: { charts, filters } } = this.props;
    charts.forEach(chart => {
      chart.query.removeFilters(filter);
    });

    const existingFilterIndex = filters.findIndex(
      existingFilter => existingFilter.path.name === filter.path.name,
    );

    if (existingFilterIndex !== -1) {
      filters.splice(existingFilterIndex, 1);
    }
  };

  onFiltersChange = () => {
    this.selectedFilter = null;
    this.setView(`FILTERLIST`);
  };

  setView = view => {
    this.view = view;
  };

  selectedFilter = null;

  view = `FILTERLIST`;

  render() {
    const { filterManager } = this.props;
    const { filters } = filterManager;

    return (
      <React.Fragment>
        <Header title="Filters" />
        <Body>
          <Section>
            {this.view === `FILTERLIST` ? (
              <React.Fragment>
                <SectionHeader>
                  <Button
                    className="pt-small pt-intent-primary"
                    icon="add"
                    onClick={() => this.setView(`ADDFILTER`)}
                    text="Add Filter"
                  />
                </SectionHeader>
                <Menu>
                  {filters.length > 0 ? (
                    <React.Fragment>
                      {filters.map(filter => (
                        <React.Fragment key={`${filter.path.name}`}>
                          <ControlGroup>
                            <Button
                              className="pt-minimal pt-intent-danger"
                              icon="delete"
                              onClick={() => this.onFilterRemove(filter)}
                            />
                            <MenuDivider title={filter.path.label} />
                          </ControlGroup>
                          <ControlGroup fill>
                            <Button
                              className="pt-small pt-minimal pt-intent-success"
                              onClick={() => this.onFilterClick(filter)}
                              text={filter.operation}
                            />
                            <MenuItem
                              labelElement={<Icon icon="chevron-right" />}
                              onClick={() => this.onFilterClick(filter)}
                              shouldDismissPopover={false}
                              text={
                                filter.value.length > 1
                                  ? `${filter.value.length} Selected`
                                  : filter.value[0]
                              }
                            />
                          </ControlGroup>
                          <FilterValues className="zd-attribute-values">
                            {filter.value.join(`, `)}
                          </FilterValues>
                          <MenuDivider />
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ) : (
                    <NonIdealState title="No filters applied" visual="filter" />
                  )}
                </Menu>
              </React.Fragment>
            ) : (
              <AddFilter
                add
                filterManager={filterManager}
                onFilterAdd={this.onFiltersChange}
                filter={this.selectedFilter}
              />
            )}
          </Section>
        </Body>
      </React.Fragment>
    );
  }
};

decorate(FilterControl, {
  onFiltersChange: action,
  onFilterClick: action,
  onFilterRemove: action,
  selectedFilter: observable.ref,
  setView: action,
  view: observable,
});

FilterControl = observer(FilterControl);

export { FilterControl };
