import PropTypes from 'prop-types';
import InputFloatField from '../InputFloatField';

class PopupOnBotInput extends InputFloatField {
  onBlur() {
    const { minValue, maxValue, valueDefault } = this.props;
    const { value } = this.state;
    if (value < (minValue + 1) && value !== valueDefault) {
      this.setState({
        isValid: false,
      });
    }
    if ((value > maxValue) || (value < minValue) || value === '') {
      this.setState({
        isValid: false,
      });
    }
  }

  render() {
    return super.render();
  }
}

PopupOnBotInput.propTypes = {
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

PopupOnBotInput.defaultProps = {
  isEdit: false,
  id: 0,
  fontSize: '',
  minValue: 0,
  maxValue: 0,
  isError: false,
  placeholder: '',
  maxAfterDot: 2,
};

export default PopupOnBotInput;
