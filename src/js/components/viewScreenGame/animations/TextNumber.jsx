import React, { PureComponent } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { setInterval, clearInterval } from 'timers';
import { convertNumber } from '../Utils';
import StyleNumber from '../../StyleNumber';

const TextWrapper = styled.div`
  height: ${props => (typeof (props.height) === 'number' ? `${props.height}px` : `${props.height}`)};
  font-size: ${props => (typeof (props.size) === 'number' ? `${props.size}px` : `${props.size}`)};
  color: ${props => props.color};
  display: flex;
  align-items: center;
  margin-left: ${props => (props.marginLeft ? `${props.marginLeft}` : '10px')};
  font-weight: 600;
  cursor: pointer;
  margin-top: 3px;
`;

class TextNumber extends PureComponent {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      currentValue: value,
      targetValue: value,
    };
    this.interval = null;
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
  }

  startCount(targetValue) {
    if (this.interval) clearInterval(this.interval);
    let { currentValue } = this.state;
    const { time, timeStep } = this.props;
    const n = time / timeStep;
    const distanceStep = Math.ceil((targetValue - currentValue) / n);
    const isUp = (distanceStep >= 0);

    this.interval = setInterval(() => {
      currentValue += distanceStep;
      let endCheck = false;
      if (isUp) {
        if (currentValue >= targetValue) {
          currentValue = targetValue;
          endCheck = true;
        }
      } else if (currentValue < targetValue) {
        currentValue = targetValue;
        endCheck = true;
      }
      this.setState({ currentValue });

      if (endCheck === true) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }, timeStep);
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { targetValue } = this.state;
    if (newProps.value !== targetValue) {
      if (targetValue !== -1) {
        this.setState({
          targetValue: newProps.value,
        });
        this.startCount(newProps.value);
      } else {
        this.setState({
          currentValue: newProps.value,
          targetValue: newProps.value,
        });
      }
    }
  }

  render() {
    const { currentValue } = this.state;
    const {
      height, size, color, onClick, marginLeft, // tail,
    } = this.props;
    // const text = (currentValue !== null && currentValue !== undefined)
    //   ? `${convertNumber(currentValue)}${tail}` : '0';
    return (
      <TextWrapper
        height={height}
        size={size}
        color={color}
        marginLeft={marginLeft}
        onClick={() => {
          if (onClick) onClick();
        }}
      >
        <StyleNumber
          value={currentValue}
          afterDot={2}
          color={color}
        />
      </TextWrapper>
    );
  }
}

TextNumber.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  color: PropTypes.string,
  value: PropTypes.number.isRequired,
  time: PropTypes.number,
  timeStep: PropTypes.number,
  tail: PropTypes.string,
  onClick: PropTypes.func,
  marginLeft: PropTypes.string,
};

TextNumber.defaultProps = {
  size: 18,
  color: 'white',
  time: 2000, // millisecond
  timeStep: 50, // millisecond
  tail: '',
  onClick: null,
  marginLeft: null,
};

export default TextNumber;
