import { ButtonGroup } from '@blueprintjs/core';
import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import colors from '../../../utils/colors';
import FilterControl from '../../FilterControl';
import { Control } from './control';
import { Divider } from './divider';
import { Title } from './title';

const View = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  background-color: ${colors.zoomdataBlue};
  padding: 5px 15px;
  width: 100%;
`;

let Header = ({ title }) => (
  <View>
    <Title value={title} />
    <Divider />
    <ButtonGroup>
      <Control
        className="pt-minimal pt-intent-primary"
        content={<FilterControl />}
        icon="filter-list"
      />
    </ButtonGroup>
  </View>
);

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

Header = flowRight([observer])(Header);

export { Header };
