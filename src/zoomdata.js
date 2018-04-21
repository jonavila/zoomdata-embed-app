import axios from 'axios';

const { ZoomdataSDK } = window;

export const application = {
  host: 'jonathans-macbook-pro.local',
  port: 8080,
  path: '/zoomdata',
  secure: false,
};

export const clientId =
  'RW1iZWRBcHAxNTI0MDg1MzQ5NTM0ZDFlY2YxOWMtMjlhYi00YTUxLWJkYzgtMzAwOGRmOGRhMWY3';

export const SDK = ZoomdataSDK;

export const baseURL = `${application.secure ? 'https' : 'http'}://${
  application.host
}:${application.port}${application.path}`;

const zoomdataAxios = axios.create({
  baseURL,
});

export { zoomdataAxios as request };
