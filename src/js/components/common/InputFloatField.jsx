import PropTypes from 'prop-types';
import InputNumberField from './InputNumberField';

const Filter = '0123456789.';
export const validateFilter = (value, filter = Filter) => {
  const textValue = `${value}`.replace(',', '.');
  let countDot = 0;
  for (let i = 0; i < textValue.length; i += 1) {
    if (textValue[i] === '.') {
      countDot += 1;
    }
    if (filter.includes(textValue[i]) === false) return false;
  }
  if (countDot > 1) return false;
  return true;
};

export const convertFloatText = (value, maxAfterDot) => {
  const textValue = `${value}`.replace(',', '.');
  let countDot = 0;
  let firstDotIndex = textValue.length;
  for (let i = 0; i < textValue.length; i += 1) {
    if (textValue[i] === '.') {
      countDot += 1;
      if (countDot === 1) firstDotIndex = i;
    }
  }

  return textValue.substring(0, firstDotIndex + maxAfterDot + 1);
};

class InputFloatField extends InputNumberField {
  onChange(event) {
    const {
      minValue, maxValue, maxAfterDot,
      isError, handleChangeProps,
    } = this.props;
    let { value } = event.target;
    if (/^0\d/g.test(value)) {
      value = Number(value);
    }

    const check = validateFilter(value);
    if (check === false) return;
    const textValue = convertFloatText(value, maxAfterDot);
    if ((maxValue >= value) || (value >= minValue)) {
      value = parseFloat(textValue, 10);
      this.setState({
        isValid: true,
        value: textValue,
        isEdit: true,
      });
      if (isError) handleChangeProps(true, 'isValidGC');
    }
    if (value === '') {
      this.setState({
        isValid: false,
        value: textValue,
        isEdit: false,
      });
    }
  }

  render() {
    return super.render();
  }
}

InputFloatField.propTypes = {
  id: PropTypes.number,
  valueDefault: PropTypes.number.isRequired,
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  isEdit: PropTypes.bool,
  handleChangeInput: PropTypes.func.isRequired,
  fontSize: PropTypes.string,
  isError: PropTypes.bool,
  handleChangeProps: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  maxAfterDot: PropTypes.number,
};

InputFloatField.defaultProps = {
  isEdit: false,
  id: 0,
  fontSize: '',
  minValue: 0,
  maxValue: 0,
  isError: false,
  placeholder: '',
  maxAfterDot: 2,
};

export default InputFloatField;
