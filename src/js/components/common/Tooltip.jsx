import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
// import { isMobile } from 'react-device-detect';

const isMobile = false;
const WrapperTooltip = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  white-space: pre-wrap;

  &: hover, {
    #my-tooltip-inner {
      visibility: visible;
    }
  }
`;

const TooltipInner = styled.div`
  visibility: hidden;
  right: calc(100% + 8px);
  top: 0;
  height: max-content;
  width: 16em;
  font-size: 0.6em;
  color: #fff;
  background: #000;
  position: absolute;
  padding: 0.25rem 0.5rem;
  text-align: center;
  background-color: #000;
  border-radius: 0.25rem;
  opacity: 0.8;

  &: after {
    content: '';
    display: block;
    position: absolute;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid #111;
    top: 8px;
    right: -8px;
    transform: rotate(180deg);
  }
`;

export const BUTTON_MODE = {
  AUTO: 0,
  DESKTOP: 1,
  MOBILE: 2,
};

class Tooltip extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.showTooltip = this.showTooltip.bind(this);
  }

  componentDidMount() { }

  handleMouseEnter() {
    this.setState({ isShow: true });
  }

  handleMouseLeave() {
    this.setState({ isShow: false });
  }

  showTooltip() {
    const { isShow } = this.state;
    this.setState({ isShow: !isShow });
  }

  render() {
    const { mode } = this.props;
    return (
      <WrapperTooltip
        onMouseEnter={() => {
          if (mode === BUTTON_MODE.DESKTOP) {
            this.handleMouseEnter();
          } else if (mode === BUTTON_MODE.AUTO && isMobile === false) {
            this.handleMouseEnter();
          }
        }}
        onMouseLeave={this.handleMouseLeave}
        onTouchStart={() => {
          if (mode === BUTTON_MODE.MOBILE) {
            this.showTooltip();
          } else if (mode === BUTTON_MODE.AUTO && isMobile === true) {
            this.showTooltip();
          }
        }}
      >
        {this.props.icon}
        {
          this.state.isShow ? (
            <TooltipInner id="my-tooltip-inner">
              {this.props.text}
            </TooltipInner>
          ) : null
        }
      </WrapperTooltip>
    );
  }
}

Tooltip.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.any.isRequired,
  mode: PropTypes.number,
};

Tooltip.defaultProps = {
  text: '',
  mode: BUTTON_MODE.AUTO,
};

export default Tooltip;
