import { ButtonGroup, NavbarDivider, Popover } from '@blueprintjs/core';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import colors from '../../../utils/colors';
import { FilterControl } from '../../controls/filter-control/filterControl';
import { Button } from './button';
import { Title } from './title';

const View = styled.div`
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  background-color: ${colors.zoomdataBlue};
  padding: 5px 15px;
  width: 100%;
`;

let Header = ({ filterManager, title }) => {
  const { filters } = filterManager;
  return (
    <View className="pt-dark">
      <Title value={title} />
      <NavbarDivider />
      <ButtonGroup>
        {filterManager ? (
          <Popover
            className="pt-dark"
            content={<FilterControl filterManager={filterManager} />}
            popoverClassName="zd-popover"
            target={
              <Button
                className={`pt-minimal pt-intent-${
                  filters.length > 0 ? `success` : `primary`
                }`}
                icon="filter-list"
              />
            }
          />
        ) : null}
      </ButtonGroup>
    </View>
  );
};

Header.propTypes = {
  filterManager: PropTypes.shape({
    charts: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    client: PropTypes.shape({}).isRequired,
    filters: PropTypes.oneOfType([MobxPropTypes.observableArray]).isRequired,
    metaThread: PropTypes.shape({}).isRequired,
    source: PropTypes.shape({}).isRequired,
  }),
  title: PropTypes.string.isRequired,
};

Header.defaultProps = {
  filterManager: null,
};

Header = observer(Header);

export { Header };
