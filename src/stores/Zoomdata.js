import { decorate, flow, observable, extendObservable } from 'mobx';

const { ZoomdataSDK, $ } = window;

export const application = {
  host: 'preview.zoomdata.com',
  port: 443,
  path: '/zoomdata',
  secure: true,
};

export const credentials = {
  key: 'UZUwYrTcLb',
};

export const getControlsCfg = source => {
  let { controlsCfg } = source;
  const playerControlCfg = controlsCfg && controlsCfg.playerControlCfg;
  if (!controlsCfg) {
    controlsCfg = {
      playerControlCfg: {},
      timeControlCfg: null,
    };
  }
  if (source.playbackMode) {
    controlsCfg.playerControlCfg = {
      pauseAfterRead: !source.live,
      timeWindowScale: playerControlCfg.timeWindowScale,
    };
    if (!source.live) {
      controlsCfg.playerControlCfg.stopTime = '$end_of_data';
    }
  }
  return controlsCfg;
};

export const getVisVariables = (source, chartName) =>
  source.visualizations.filter(
    visualization => visualization.name === chartName,
  )[0].source.variables;

class Zoomdata {
  sources = [];
  visualizations = [];

  constructor() {
    const instance = this;
    let timeoutId;

    window.onresize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(instance.onWindowResize, 100);
    };

    instance.getClient = flow(function*() {
      try {
        const client = yield ZoomdataSDK.createClient({
          credentials,
          application,
        });
        extendObservable(instance, { client }, {}, { deep: false });
      } catch (err) {
        console.error(err.message);
      }
    });

    instance.getClient();
  }

  onWindowResize = () => {
    this.visualizations.forEach(visualization => {
      visualization.resize(
        $(visualization.element.parentNode).width(),
        $(visualization.element.parentNode).height(),
      );
    });
  };
}

decorate(Zoomdata, {
  sources: observable.shallow,
  visualizations: observable.shallow,
});

export default Zoomdata;
