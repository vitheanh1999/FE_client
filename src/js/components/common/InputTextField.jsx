import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import i18n from '../../i18n/i18n';
import { ButtonCore } from '../listBots/listBotsStyle';
import { images } from '../../theme';

const Message = styled.div`
  font-size: 0.4em;
  font-weight: 900;
  color: red;
`;

const styleInput = {
  fontSize: '1em',
  width: '90%',
};

class InputTextField extends Component {
  constructor(props) {
    super(props);
    const { isEdit } = this.props;
    this.state = {
      value: '',
      isEdit,
      isMaxSize: false,
      isMinSize: false,
    };
  }

  onChange(event) {
    const { minSize, maxSize } = this.props;
    const { isMaxSize, isMinSize } = this.state;
    const { value } = event.target;
    if (value.length > maxSize) {
      if (!isMaxSize) this.setState({ isMaxSize: true });
    } else {
      if (isMaxSize) {
        this.setState({ isMaxSize: false });
      }
      this.setState({ value });
    }
    if (value.length > minSize && isMinSize) this.setState({ isMinSize: false });
  }

  onEdit() {
    this.setState({ value: this.props.valueDefault, isEdit: true });
  }

  onSubmit() {
    const {
      handleChangeInput, id,
      valueDefault, minSize,
    } = this.props;
    const { value } = this.state;
    const { isMinSize } = this.state;
    if (value.length < minSize) {
      if (!isMinSize) this.setState({ isMinSize: true });
      document.getElementById('input').focus();
    } else {
      this.setState({ isEdit: false });
      if (value !== valueDefault) {
        handleChangeInput(value, id);
      }
    }
  }

  changeEditMode(value) {
    this.setState({ isEdit: value });
  }

  render() {
    const {
      maxSize, valueDefault, // minSize,
    } = this.props;
    const {
      isEdit, value,
      isMaxSize, isMinSize,
    } = this.state;
    const valueInput = value || valueDefault;

    return (
      <div style={{ display: 'flex' }}>
        {isEdit ? (
          <Fragment>
            <div>
              <input
                id="input"
                type="text"
                value={value}
                onChange={e => this.onChange(e)}
                // onBlur={() => this.handleBlur()}
                style={styleInput}
                autoFocus
              />
              {isMaxSize && (<Message>{i18n.t('txtFieldMaxSize').concat(maxSize)}</Message>)}
              {isMinSize && (<Message>{i18n.t('txtFieldMinSize')}</Message>) }
            </div>
            <ButtonCore
              fontSize="1em"
              hoverBgColor="#23B083"
              padding="0.2em 0.5em 0.2em 0.5em"
              onClick={() => this.onSubmit()}
            >
              <img
                src={images.saveWhite}
                alt="view mode"
                id="view-mode-btn"
              />
            </ButtonCore>
          </Fragment>
        )
          : (
            <Fragment>
              {valueInput}
              <ButtonCore
                fontSize="1em"
                hoverBgColor="#20bcdf"
                padding="0.2em 0.5em 0.2em 0.5em"
                opacity="0.5"
                onClick={() => this.onEdit()}
              >
                <img
                  src={images.editWhite}
                  alt="view mode"
                  id="view-mode-btn"
                />
              </ButtonCore>
            </Fragment>
          )
        }

      </div>
    );
  }
}

InputTextField.propTypes = {
  id: PropTypes.number,
  valueDefault: PropTypes.string.isRequired,
  maxSize: PropTypes.number,
  minSize: PropTypes.number,
  isEdit: PropTypes.bool,
  handleChangeInput: PropTypes.func.isRequired,
};

InputTextField.defaultProps = {
  maxSize: 20,
  minSize: 6,
  isEdit: false,
  id: 0,
};

export default InputTextField;
