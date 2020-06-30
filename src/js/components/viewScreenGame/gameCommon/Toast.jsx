import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ToastMessage = styled.div`
  padding-left: 10px;
  padding-right: 10px;
  height: 50px;
  background: black;
  color: white;
  position: absolute;
  left: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -54%);
  border-radius: 4px;
  border-width: 2px;
  border-color: gray;
  border-style: solid;
  white-space: pre-line;
  z-index: 1;
  user-select: none;
  pointer-events: none;
`;

class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idToast: '',
      opacity: 0,
      visible: false,
      contentToast: '',
      timeShow: 3000,
    };
    this.fadeInInterval = null;
    this.showTimeOut = null;
    this.fadeOutInterval = null;
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
      opacity: 0,
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
    let { opacity } = this.state;
    opacity -= 0.05;
    if (opacity <= 0) {
      opacity = 0;
      this.setState({ opacity, visible: false });
      clearInterval(this.fadeOutInterval);
      this.fadeOutInterval = null;
    } else {
      this.setState({ opacity });
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
      opacity, visible, contentToast,
    } = this.state;
    const { customStyle } = this.props;
    if (visible === false) return <div />;
    return (
      <ToastMessage id="ToastMessage" style={{ ...customStyle, opacity }}>
        {contentToast}
      </ToastMessage>
    );
  }
}

Toast.propTypes = {
  // contentToast: PropTypes.string.isRequired,
  customStyle: PropTypes.objectOf(PropTypes.any),
};

Toast.defaultProps = {
  customStyle: {},
};
export default Toast;
