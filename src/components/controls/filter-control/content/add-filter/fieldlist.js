import flowRight from 'lodash.flowright';
import { action, decorate, observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { handleStringChange } from '../../../../../utils/inputUtils';
import { Menu } from '../../../../popover/body/menu/menu';
import { InputGroup } from '../../../../popover/body/inputGroup';

let FieldList = class FieldList extends Component {
  setSearchInputValue = handleStringChange(value => {
    this.searchInputValue = value;
  });

  searchInputValue = ``;

  render() {
    return (
      <React.Fragment>
        <InputGroup
          leftIcon="search"
          onChange={this.setSearchInputValue}
          placeholder="Search Fields"
        />
        <Menu />
      </React.Fragment>
    );
  }
};

decorate(FieldList, {
  searchInputValue: observable,
  setSearchInputValue: action,
});

FieldList = flowRight([observer])(FieldList);

export { FieldList };
