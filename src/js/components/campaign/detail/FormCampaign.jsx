import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Form from '../../common/Form';

const WrapperInput = styled.div`
  font-size: 1em;
  font-family: Arial, sans-serif;
  border-radius: 0.13334em;
  background-color: #efefef;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: black;
  width: ${props => props.width && props.width}em;
`;

const Input = styled.input`
  border: none;
  min-height: 1.4em;
  height: 2em;
  padding: 0.278em;
  border-radius: 0.13334em;
  width: ${props => (props.inputText ? 60 : 100)}%;
  background-color: ${props => (props.disabled ? '#61636175' : '#efefef')};
`;

const InputText = styled.div`
  padding: 0 0.5em 0 0.5em;
  background-color: #dee2e6;
  min-height: 1.4em;
  height: 2em;
  display: flex;
  align-items: center;
  border-radius: 0 0.278em 0.278em 0;
  width: 40%;
  border-left: 2px solid #adb5bd;

  > span {
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.8em;
    line-height: 1.2;
  }
`;

export default class FormCampaign extends Form {
  onChangeText(event) {
    const { onChange, maxLength } = this.props;
    if (maxLength >= 0) {
      if (event.target.value.length <= maxLength) {
        onChange(event);
      }
    } else {
      onChange(event);
    }
  }

  renderInput() {
    const {
      type, name,
      value, disabled, autoFocus,
      placeholder, maxLength, pattern,
      inputText, width, onFocus,
    } = this.props;
    const { focus } = this.state;
    return (
      <WrapperInput width={width}>
        <Input
          type={type}
          onChange={event => this.onChangeText(event)}
          onFocus={() => {
            this.onFocus();
            onFocus();
          }}
          onBlur={e => this.onBlurInput(e)}
          ref={this.inputRef}
          focus={focus}
          name={name}
          value={value}
          pattern={pattern && pattern}
          disabled={disabled}
          maxLength={maxLength === -1 ? '' : maxLength}
          onKeyUp={e => this.onKeyUp(e)}
          onKeyDown={e => this.onKeyDown(e)}
          autoFocus={autoFocus}
          placeholder={placeholder}
          inputText={inputText}
          multiline
          autoComplete="off"
        />
        {inputText && (<InputText><span>{inputText}</span></InputText>)}
      </WrapperInput>
    );
  }
}

FormCampaign.propTypes = {
  inputText: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onFocus: PropTypes.func,
};

FormCampaign.defaultProps = {
  inputText: '',
  width: 17,
  onFocus: () => {},
};
