import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import Popper from 'popper.js';

const tooltipRoot = document.getElementById('tooltip-root');

let ChartTooltip = class ChartTooltip extends Component {
  static propTypes = {
    coordinates: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }).isRequired,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    show: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    this.el = document.createElement('div');
    this.el.classList.add('zd_controls_tooltip_content');
    this.tooltipShape = document.createElement('div');
    this.tooltipShape.classList.add('zd_controls_tooltip_shape');
  }

  componentDidMount() {
    const { coordinates } = this.props;
    tooltipRoot.appendChild(this.el);
    const reference = {
      getBoundingClientRect() {
        return {
          top: coordinates.y,
          left: coordinates.x,
          right: coordinates.x + 1,
          bottom: coordinates.y + 1,
          width: 1,
          height: 1,
        };
      },
      get getClientWidth() {
        return 1;
      },
      get getClientHeight() {
        return 1;
      },
    };

    this.popper = new Popper(reference, tooltipRoot);
  }

  componentWillUnmount() {
    tooltipRoot.removeChild(this.el);
  }

  render() {
    const { coordinates, show } = this.props;
    if (this.popper) {
      this.popper.reference.getBoundingClientRect = function getBoundingClientRect() {
        return {
          top: coordinates.y,
          left: coordinates.x,
          right: coordinates.x + 1,
          bottom: coordinates.y + 15,
          width: 1,
          height: 1,
        };
      };
      this.popper.scheduleUpdate();
    }

    if (!show) {
      tooltipRoot.innerHTML = '';
    } else {
      tooltipRoot.appendChild(this.el);
      tooltipRoot.appendChild(this.tooltipShape);
    }
    return ReactDOM.createPortal(this.props.children, this.el);
  }
};

ChartTooltip = observer(ChartTooltip);

export { ChartTooltip };
