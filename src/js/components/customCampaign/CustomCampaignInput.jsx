import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { validateFilter, convertFloatText } from '../common/InputFloatField';
import warningIcon10 from '../../../assets/lucImages/game-element-img/warning_icon10.png';

const StyleInput = styled.input`
  font-size: ${props => props.fontSize}em;
  width: 100%;
  border: none;
  :focus {
    outline: none;
  }
`;

const Wrapper = styled.div`
  background-color: ${props => (props.disabled ? '#aaa' : '#fff')};
  border-radius: 0.278em;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0.2em;
  border: 1px solid ${props => (props.isRequired ? 'red' : 'gray')};
`;

const IconRequired = styled.img`
  width: 1em;
  position: absolute;
  right: 2px;
`;

const Filter = '0123456789.';

class CustomCampaignInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRequired: false,
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    const {
      afterDot, minValue, maxValue, enableEqualMin, enableEqualMax,
    } = this.props;
    const check = validateFilter(event.target.value, Filter);
    if (check === false) return;
    const textValue = convertFloatText(event.target.value, afterDot);
    const floatValue = parseFloat(textValue, 10);
    let checkMinMax = true;
    if (floatValue > maxValue) checkMinMax = false;
    if (floatValue < minValue) checkMinMax = false;
    if (floatValue === maxValue && enableEqualMax === false) checkMinMax = false;
    if (floatValue === minValue && enableEqualMin === false) checkMinMax = false;
    if (checkMinMax) {
      const { onChange } = this.props;
      onChange(textValue);
    }
  }

  validate() {
    const { value } = this.props;
    if (value === '') {
      this.setState({
        isRequired: true,
      });
      return false;
    }
    return true;
  }

  render() {
    const {
      value, height, fontSize, isDisabled, onBlur,
    } = this.props;

    const { isRequired } = this.state;

    return (
      <Wrapper isRequired={isRequired} disabled={isDisabled}>
        <StyleInput
          id="number"
          value={value}
          onChange={event => this.onChange(event)}
          onBlur={() => {
            if (value === '') {
              this.setState({
                isRequired: true,
              });
            }
            onBlur();
          }}
          onFocus={() => {
            this.setState({
              isRequired: false,
            });
          }}
          height={height}
          fontSize={fontSize}
          disabled={isDisabled}
        />
        {
          isRequired && <IconRequired src={warningIcon10} />
        }
      </Wrapper>
    );
  }
}

CustomCampaignInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.any]).isRequired,
  afterDot: PropTypes.number,
  onBlur: PropTypes.func,
  height: PropTypes.number,
  fontSize: PropTypes.number,
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  enableEqualMin: PropTypes.bool,
  enableEqualMax: PropTypes.bool,
  isDisabled: PropTypes.bool,
};
CustomCampaignInput.defaultProps = {
  afterDot: 0,
  onBlur: () => { },
  fontSize: 1,
  height: 1.5,
  minValue: 1,
  maxValue: 1000000000,
  enableEqualMin: true,
  enableEqualMax: true,
  isDisabled: false,
};
export default CustomCampaignInput;
