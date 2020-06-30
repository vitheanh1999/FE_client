import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StyleInput } from '../mainContainer/mainStyle';
import { validateFilter, convertFloatText } from './InputFloatField';

const Filter = '0123456789.';

class InputFloat extends Component {
  constructor(props) {
    super(props);
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

  render() {
    const {
      value, width, height, fontSize, customStyle, placeholder,
    } = this.props;
    return (
      <StyleInput
        id="number"
        value={value}
        style={customStyle}
        onChange={event => this.onChange(event)}
        onBlur={this.props.onBlur}
        placeholder={placeholder}
        width={width}
        height={height}
        fontSize={fontSize}
      />
    );
  }
}

InputFloat.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.any]).isRequired,
  afterDot: PropTypes.number,
  onBlur: PropTypes.func,
  width: PropTypes.number,
  height: PropTypes.number,
  fontSize: PropTypes.number,
  customStyle: PropTypes.objectOf(PropTypes.any),
  maxValue: PropTypes.number,
  minValue: PropTypes.number,
  placeholder: PropTypes.string,
  enableEqualMin: PropTypes.bool,
  enableEqualMax: PropTypes.bool,
};
InputFloat.defaultProps = {
  afterDot: 2,
  onBlur: () => {},
  fontSize: 1,
  width: 4,
  height: 1.5,
  customStyle: {},
  minValue: 0,
  maxValue: 1000000000,
  placeholder: '',
  enableEqualMin: false,
  enableEqualMax: false,
};
export default InputFloat;
