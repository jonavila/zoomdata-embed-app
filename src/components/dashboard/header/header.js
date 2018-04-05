import { ButtonGroup } from '@blueprintjs/core';
import flowRight from 'lodash.flowright';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import colors from '../../../utils/colors';
import { FilterControl } from '../../controls/filter-control/filterControl';
import { Popover } from '../../popover/popover';
import { Button } from './button';
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

let Header = ({ filterManager, title }) => (
  <View>
    <Title value={title} />
    <Divider />
    <ButtonGroup>
      {filterManager ? (
        <Popover
          content={<FilterControl filterManager={filterManager} />}
          target={
            <Button
              className="pt-minimal pt-intent-primary"
              icon="filter-list"
            />
          }
        />
      ) : null}
    </ButtonGroup>
  </View>
);

Header.propTypes = {
  filterManager: PropTypes.shape({
    client: PropTypes.shape({}).isRequired,
    filters: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    metaThread: PropTypes.shape({}).isRequired,
    source: PropTypes.shape({}).isRequired,
  }),
  title: PropTypes.string.isRequired,
};

Header.defaultProps = {
  filterManager: null,
};

Header = flowRight([observer])(Header);

export { Header };
