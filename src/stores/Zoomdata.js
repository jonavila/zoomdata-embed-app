import { decorate, flow, observable, extendObservable } from 'mobx';

const { ZoomdataSDK, $ } = window;

class Zoomdata {
  filters = [];
  sources = [];
  visualizations = [];

  constructor({ application, credentials }) {
    let timeoutId;

    window.onresize = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(this.onWindowResize, 100);
    };

    this.getClient({ application, credentials });
  }

  onWindowResize = () => {
    this.visualizations.forEach(visualization => {
      visualization.resize(
        $(visualization.element.parentNode).width(),
        $(visualization.element.parentNode).height(),
      );
    });
  };

  getClient = flow(function*({ application, credentials }) {
    try {
      const client = yield ZoomdataSDK.createClient({
        credentials,
        application,
      });
      extendObservable(this, { client }, {}, { deep: false });
    } catch (err) {
      console.error(err.message);
    }
  });
}

decorate(Zoomdata, {
  filters: observable.shallow,
  sources: observable.shallow,
  visualizations: observable.shallow,
});

export default Zoomdata;
