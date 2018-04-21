import { Callout, NonIdealState } from '@blueprintjs/core';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import styled from 'styled-components';
import { navigationHeight } from '../../utils/presets';
import { Navigation } from '../navigation/navigation';
import { SpinnerWithText } from '../spinner-with-text/spinnerWithText';
import { DashboardCards } from './dashboardCards';
// import logo from '../../assets/zoomdata-logo-charcoal.svg';
// import { Dashboard } from '../dashboard/dashboard';
// import { Navigation } from '../navigation/navigation';

// let Home = class Home extends Component {
//   constructor(props) {
//     super(props);
//     const { uiStore } = this.props;
//     when(
//       () => this.getClient.state === 'rejected',
//       () => {
//         uiStore.auth.token = null;
//       },
//     );
//   }
//
//   getClient = fromPromise(async (resolve, reject) => {
//     const { uiStore } = this.props;
//     try {
//       const client = await ZoomdataSDK.createClient({
//         credentials: { access_token: uiStore.auth.token },
//         application: UiStore.application,
//       });
//       resolve(client);
//     } catch (e) {
//       reject(e);
//     }
//   });
//
//   render() {
//     return this.getClient.case({
//       pending: () => (
//         <SpinnerWithText
//           className="pt-large"
//           text="Waiting for Zoomdata client..."
//         />
//       ),
//       rejected: () => {
//         sessionStorage.removeItem('embedApp');
//         return <Redirect to="/login" />;
//       },
//       fulfilled: client => (
//         <React.Fragment>
//           <Navigation logo={logo} />
//           <Dashboard client={client} />
//         </React.Fragment>
//       ),
//     });
//   }
// };
//
// decorate(Home, {});
//
// Home = flowRight([inject('uiStore'), observer])(Home);
//
// Home.wrappedComponent.propTypes = {
//   uiStore: PropTypes.shape({ auth: MobxPropTypes.observableObject }).isRequired,
// };
//
// export { Home };

const View = styled.div`
  margin-top: ${navigationHeight}px;

  & > .pt-callout {
    flex: 1;
  }
`;

@inject('authentication', 'dashboardStore')
@observer
export class Home extends Component {
  componentDidMount() {
    const { dashboardStore } = this.props;
    dashboardStore.getClient();
    dashboardStore.load();
  }

  render() {
    const {
      authentication: { user },
      dashboardStore,
    } = this.props;

    if (dashboardStore.fetchStatus === 'pending') {
      return <SpinnerWithText text="Loading Dashboards..." />;
    }

    return (
      <React.Fragment>
        <Navigation user={user} />
        <View>
          <Callout intent="primary" title="Dashboards">
            <p>
              The following is a list of dashboards accessible to the current
              user. Please click on dashboard to see its charts embedded in this
              application
            </p>
          </Callout>
          {dashboardStore.fetchStatus === 'fulfilled' ? (
            <DashboardCards dashboards={dashboardStore.dashboards} />
          ) : (
            <NonIdealState title="Error loading dashboards" />
          )}
        </View>
      </React.Fragment>
    );
  }
}

Home.wrappedComponent.propTypes = {
  authentication: PropTypes.shape({}).isRequired,
  dashboardStore: PropTypes.shape({}).isRequired,
};
