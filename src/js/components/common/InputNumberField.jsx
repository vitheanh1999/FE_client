import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from '../../i18n/i18n';
import { ButtonAdd, Message, WrapperInput } from '../mainContainer/mainStyle';
import { images } from '../../theme';
import StyleNumber from '../StyleNumber';

const styleInput = {
  width: '100%',
  height: '2em',
  paddingLeft: '4%',
  borderRadius: '0.13334em',
  border: 'solid 1px #ccc',
};

class InputNumberField extends Component {
  constructor(props) {
    super(props);
    const { isEdit } = this.props;
    this.state = {
      value: '',
      isEdit,
      isValid: true,
    };
  }

  onChange(event) {
    const {
      minValue, maxValue,
      isError, handleChangeProps,
    } = this.props;
    const { target } = event;
    const value = target.value ? parseInt(target.value, 10) : target.value;
    if ((maxValue >= value) || (value >= minValue)) {
      this.setState({
        isValid: true,
        value,
        isEdit: true,
      });
      if (isError) handleChangeProps(true, 'isValidGC');
    }
  }

  onBlur() {
    const { minValue, maxValue } = this.props;
    const { value } = this.state;
    if ((value > maxValue) || (value < minValue) || value === '') {
      this.setState({
        isValid: false,
      });
    }
  }

  onEdit() {
    this.setState({ value: this.props.valueDefault, isEdit: true });
    this.props.handleChangeProps(true, 'isChangeGc');
  }

  onSubmit() {
    const {
      handleChangeInput, id,
      valueDefault, isError, handleChangeProps,
    } = this.props;
    const { value } = this.state;
    const gc = Number(value);
    if (gc !== valueDefault && this.state.isValid) {
      handleChangeProps(false, 'isChangeGc');
      handleChangeInput(gc, id);
      this.setState({ isEdit: false });
    } else if (gc && this.state.isValid) {
      handleChangeProps(false, 'isChangeGc');
      this.setState({ isEdit: false });
    }
    if (isError) {
      handleChangeProps(true, 'isValidGC');
    }
  }

  render() {
    const {
      valueDefault, fontSize, isError,
      minValue, maxValue, placeholder,
    } = this.props;
    const { isEdit, value, isValid } = this.state;
    const messageErrorGc = minValue !== maxValue
      ? i18n.t('ChargeGCErrorInput', { minGC: (minValue + 1).toLocaleString('ja'), maxGC: maxValue.toLocaleString('ja') })
      : i18n.t('userNotCharge');
    return (
      <div>
        {isEdit || isError ? (
          <WrapperInput width="12.5em" fontSize={fontSize}>
            <div>
              <input
                id="number"
                type="number"
                value={value || ''}
                onChange={e => this.onChange(e)}
                onBlur={() => this.onBlur()}
                style={styleInput}
                placeholder={placeholder}
              />
            </div>
            <ButtonAdd
              fontSize="1em"
              hoverBgColor="#23B083"
              padding="0.2em 0.5em 0.2em 0.5em"
              margin="0 0 0 0.5em"
              opacity="0.5"
              width="2em"
              height="2em"
              onClick={() => this.onSubmit()}
              bgrImage={images.saveWhite}
            />
          </WrapperInput>
        )
          : (
            <WrapperInput fontSize={fontSize}>
              <StyleNumber
                value={valueDefault}
                afterDot={2}
                color="#fff"
              />
              <ButtonAdd
                fontSize="1em"
                hoverBgColor="#2d889c"
                padding="0.2em 0.5em 0.2em 0.5em"
                margin="0 0 0 0.5em"
                onClick={() => this.onEdit()}
                width="2em"
                height="2em"
                bgrImage={images.editWhite}
              />
            </WrapperInput>
          )
        }
        {
          (!isValid || isError) && (
            <Message fontSize="0.7em">
              {value && isError ? i18n.t('pleaseSaveField') : messageErrorGc}
            </Message>
          )
        }
      </div>
    );
  }
}

InputNumberField.propTypes = {
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
};

InputNumberField.defaultProps = {
  isEdit: false,
  id: 0,
  fontSize: '',
  minValue: 0,
  maxValue: 0,
  isError: false,
  placeholder: '',
};

export default InputNumberField;
