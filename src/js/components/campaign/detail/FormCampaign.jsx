import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Form from '../../common/Form';

const WrapperInput = styled.div`
  font-size: 0.9em;
  font-family: Arial, sans-serif;
  border-radius: 0.278em;
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
  height: 2.38em;
  padding: 0.278em;
  border-radius: 0.278em;
  width: ${props => (props.inputText ? 60 : 100)}%;
  background-color: ${props => (props.disabled ? '#ccc;' : '##efefef;')};
`;

const InputText = styled.div`
  padding: 0 0.5em 0 0.5em;
  background-color: #dee2e6;
  min-height: 1.4em;
  height: 2.38em;
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
  renderInput() {
    const {
      onChange, type, name,
      value, disabled, autoFocus,
      placeholder, maxLength, pattern,
      inputText, width,
    } = this.props;
    const { focus } = this.state;
    return (
      <WrapperInput width={width}>
        <Input
          type={type}
          onChange={onChange}
          onFocus={() => this.onFocus()}
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
        />
        {inputText && (<InputText><span>{inputText}</span></InputText>)}
      </WrapperInput>
    );
  }
}

FormCampaign.propTypes = {
  inputText: PropTypes.string,
  width: PropTypes.number,
};

FormCampaign.defaultProps = {
  inputText: '',
  width: 17,
};
