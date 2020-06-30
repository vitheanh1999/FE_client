import { Component } from 'react';
import PropTypes from 'prop-types';
import { convertBotRemainTime } from '../../helpers/utils';

export default class Countdown extends Component {
  constructor(props) {
    super(props);
    this.interval = null;

    this.state = {
      secondsCurrent: 0,
    };

    this.interval = null;
    this.startTimer = this.startTimer.bind(this);
    this.stop = this.stop.bind(this);
  }

  componentWillUnmount() {
    this.stop();
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { secondsCurrent } = this.state;
    if (!newProps.seconds) {
      this.stop();
    } else if (!secondsCurrent && newProps.seconds) {
      // this.setState({ secondsCurrent: newProps.seconds });
      this.startTimer(newProps.seconds);
    } else if (secondsCurrent && newProps.seconds) {
      this.startTimer(newProps.seconds);
    }
  }

  startTimer(secondsCurrent) {
    let time = secondsCurrent;
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      time -= 1;
      this.setState({ secondsCurrent: time });
      if (time === 0) this.stop();
    }, 1000);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
    this.setState({ secondsCurrent: 0 });
  }

  render() {
    const { renderTime } = this.props;
    const { secondsCurrent } = this.state;
    const time = convertBotRemainTime(secondsCurrent);

    return renderTime({ time, secondsCurrent });
  }
}

Countdown.defaultProps = {
};

Countdown.propTypes = {
  renderTime: PropTypes.func.isRequired,
};
