import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ToastMessage = styled.div`
  padding-left: 1em;
  padding-right: 1em;
  padding-top: 0.5em;
  padding-bottom: 0.5em;
  min-height: 2em;
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  border-radius: 0.4em;
  border-width: 0.1em;
  border-color: gray;
  border-style: solid;
  white-space: pre-line;
  user-select: none;
  pointer-events: none;
  background: #000;
  color: #e80e0e;
  z-index: 1060;
  font-weight: 700;
  min-width: 40%;
  max-width: 90%;
  letter-spacing: normal;
`;

class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idToast: '',
      opacity: 0,
      visible: false,
      contentToast: '',
      timeShow: 1000,
      // top: 50,
    };
    this.fadeInInterval = null;
    this.showTimeOut = null;
    this.fadeOutInterval = null;
  }

  componentDidMount() {
    const { content, time } = this.props;
    this.showToast(content, time);
  }

  componentWillUnmount() {
    this.clearAllTimeOut();
  }

  clearAllTimeOut() {
    if (this.fadeInInterval) {
      clearInterval(this.fadeInInterval);
      this.fadeInInterval = null;
    }
    if (this.showTimeOut) {
      clearTimeout(this.showTimeOut);
      this.showTimeOut = null;
    }
    if (this.fadeOutInterval) {
      clearInterval(this.fadeOutInterval);
      this.fadeOutInterval = null;
    }
  }

  showToast(content, time, idToast = '') {
    this.clearAllTimeOut();
    this.setState({
      idToast,
      contentToast: content,
      timeShow: time,
      visible: true,
      opacity: 0.65,
      // top: 50,
    });
    this.fadeInInterval = setInterval(() => this.fadeIn(), 50);
  }

  fadeIn() {
    let { opacity } = this.state;
    const { timeShow } = this.state;
    opacity += 0.05;
    if (opacity >= 1) {
      opacity = 1;
      this.setState({ opacity });
      clearInterval(this.fadeInInterval);
      this.fadeInInterval = null;
      this.showTimeOut = setTimeout(() => {
        clearTimeout(this.showTimeOut);
        this.showTimeOut = null;
        this.fadeOutInterval = setInterval(() => this.fadeOut(), 50);
      }, timeShow);
    } else {
      this.setState({ opacity });
    }
  }

  fadeOut() {
    let { opacity /* , top */ } = this.state;
    opacity -= 0.05;
    // top += 2;
    if (opacity <= 0 /* || top >= 100 */) {
      opacity = 0;
      // top = 50;
      this.setState({ opacity, /* top, */ visible: false });
      clearInterval(this.fadeOutInterval);
      this.fadeOutInterval = null;

      const { callback, id } = this.props;
      if (callback && id !== null) {
        callback(id);
      }
    } else {
      this.setState({ opacity /* ,top */});
    }
  }

  closeToast(toastId = '') {
    const { idToast } = this.state;
    if (toastId.length === 0 || toastId === idToast) {
      this.clearAllTimeOut();
      this.setState({
        idToast: '',
        contentToast: '',
        timeShow: 0,
        visible: false,
        opacity: 0,
      });
    }
  }

  render() {
    const {
      opacity, visible, contentToast, timeShow,
    } = this.state;
    const { customStyle } = this.props;
    if (visible === false) return <div />;
    return (
      <ToastMessage
        id="ToastMessage"
        style={{
          ...customStyle,
          opacity: opacity,
          animationDuration: `${timeShow / 1000}s`,
        }}
      >
        {contentToast}
      </ToastMessage>
    );
  }
}

Toast.propTypes = {
  content: PropTypes.string.isRequired,
  time: PropTypes.number.isRequired,
  customStyle: PropTypes.objectOf(PropTypes.any),
  callback: PropTypes.func,
  id: PropTypes.number,
};

Toast.defaultProps = {
  customStyle: {},
  callback: null,
  id: null,
};
export default Toast;
