/* eslint-disable no-param-reassign */
import { flow, getEnv, getParent, types } from 'mobx-state-tree';
import { AppToaster } from '../utils/toaster';
import { UserModel } from './UserModel';

const AuthenticationModelToken = types.model('AuthenticationModelToken', {
  tokenValue: types.maybe(types.string),
  expiration: types.maybe(types.Date),
});

export const AuthenticationModel = types
  .model('AuthenticationModel', {
    user: types.maybe(UserModel),
    token: types.maybe(AuthenticationModelToken),
  })
  .volatile(() => ({
    username: '',
    password: '',
    logInStatus: null,
    responseInterceptor: null,
  }))
  .views(self => ({
    get hasValidToken() {
      return self.token && self.token.expiration > Date.now();
    },
  }))
  .actions(self => ({
    afterAttach() {
      if (self.token) {
        const { request } = getEnv(self).Zoomdata;
        request.defaults.headers.common.Authorization = `Bearer ${
          self.token.tokenValue
        }`;
      }
      self.createResponseInterceptor();
    },
    createResponseInterceptor() {
      const { request } = getEnv(self).Zoomdata;
      self.responseInterceptor = request.interceptors.response.use(
        response => response,
        error => {
          const { response: errorResponse, config: errorConfig } = error;
          if (
            errorResponse &&
            errorConfig &&
            errorResponse.status === 401 &&
            !errorConfig.url.match(/api\/oauth2\/token$/)
          ) {
            request.interceptors.response.eject(self.responseInterceptor);
            return self.retry401Request(errorConfig);
          }
          return Promise.reject(error);
        },
      );
    },
    setUsername(newUsername) {
      self.username = newUsername;
    },
    setPassword(newPassword) {
      self.password = newPassword;
    },
    getToken: flow(function* getToken() {
      self.logInStatus = 'pending';
      const { clientId, request } = getEnv(self).Zoomdata;
      try {
        const { data: token } = yield request({
          url: `/api/oauth2/token`,
          method: `post`,
          headers: {
            'content-type': 'application/vnd.zoomdata.v1+json',
          },
          auth: {
            username: self.username,
            password: self.password,
          },
          data: { clientId },
        });
        self.setToken(token);
        request.defaults.headers.common.Authorization = `Bearer ${
          token.tokenValue
        }`;
        self.getUser();
      } catch (error) {
        console.error('Failed to fetch token.', error.message);
        if (error.response.status) {
          AppToaster.show({
            icon: 'warning-sign',
            intent: 'danger',
            message:
              error.response.status === 401
                ? `Unauthorized: Access is denied due to invalid credentials`
                : error.message,
          });
        }
        self.logInStatus = 'error';
      }
      return self.logInStatus;
    }),
    setToken(newToken) {
      self.token = {
        tokenValue: newToken.tokenValue,
        expiration: new Date(newToken.expiration),
      };
    },
    retry401Request: flow(function* retry401Request(config) {
      const { clientId, request } = getEnv(self).Zoomdata;
      const { router } = getParent(self);
      try {
        const { data: newToken } = yield request(`/api/oauth2/token`, {
          method: 'post',
          headers: { 'content-type': 'application/vnd.zoomdata.v1+json' },
          auth: {
            username: self.username,
            password: self.password,
          },
          data: { clientId },
        });
        self.setToken(newToken);
        request.defaults.headers.common.Authorization = `Bearer ${
          newToken.tokenValue
        }`;
        return yield request(config);
      } catch (error) {
        self.destroyToken();
        self.createResponseInterceptor();
        if (router.location.pathname !== `/login`) {
          router.push('/login');
        }
        self.logInStatus = 'error';
        return Promise.reject(error);
      }
    }),
    getUser: flow(function* getUser() {
      const { request } = getEnv(self).Zoomdata;
      try {
        const { data: user } = yield request({
          url: `service/user`,
          headers: { 'content-type': 'application/json' },
        });
        self.user = user;
        self.logInStatus = 'fulfilled';
      } catch (error) {
        self.logInStatus = 'error';
      }
    }),
    destroyToken() {
      self.token = null;
    },
  }));
