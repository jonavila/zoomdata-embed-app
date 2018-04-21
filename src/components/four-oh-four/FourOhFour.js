import { NonIdealState } from '@blueprintjs/core/';
import { observer } from 'mobx-react';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import fourOhFourLogo from '../../assets/404.svg';

const View = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  min-height: 100%;
  align-items: center;

  & img {
    width: 100%;
    height: 100%;
  }
`;

export let FourOhFour = () => (
  <View>
    <NonIdealState
      action={
        <Link
          className="pt-button pt-intent-primary"
          role="button"
          tabIndex="0"
          to="/dashboards"
        >
          Return to the homepage
        </Link>
      }
      title="Page not found"
      visual={<img alt="404" src={fourOhFourLogo} />}
    />
  </View>
);

FourOhFour = observer(FourOhFour);
