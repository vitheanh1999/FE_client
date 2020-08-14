import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${props => props.margin && props.margin};
  margin-bottom: ${props => props.marginBottom}em;
  margin-right: ${props => props.marginRight}em;
`;
const Label = styled.div`
  font-weight: bold;
  color: white;
  float: left;
  text-align: left;
  padding-top: 0.3em;
  padding-bottom: ${props => props.labelPaddingBottom}px;
  text-transform: uppercase;
  font-size: 0.8em;
`;
const Input = styled.input`
  min-height: 1.4em;
  height: 2.38em;
  font-size: 0.9em;
  font-family: Arial, sans-serif;
  border-radius: 0.278em;
  border: 0 solid white;
  padding: 0.278em;
  background-color: ${props => (props.focus ? '#e1f7e9' : 'white')};
`;

const Feedback = styled.div`
  margin-top: 0.278em;
  color: red;
  float: left;
  text-align: left;
  font-size: 0.8em;
  white-space: pre-wrap;
`;

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
    this.state = {
      focus: false,
    };
  }

  componentDidMount() {

  }

  onFocus() {
    this.setState({
      focus: true,
    });
  }

  onBlurInput(value) {
    const { onBlur } = this.props;
    this.setState({
      focus: false,
    });
    if (onBlur) onBlur(value);
  }

  onKeyUp(event) {
    const { onEnter } = this.props;
    if (onEnter && event.keyCode === 13) {
      onEnter(event);
    }
  }

  onKeyDown(event) {
    const { isAllowWhiteSpace } = this.props;
    if (isAllowWhiteSpace === false && event.keyCode === 32) { // user input white space
      event.preventDefault();
    }
  }

  renderFormFeedback() {
    const { isValid, invalidText } = this.props;
    if (isValid) {
      return null;
    }
    return (
      <Feedback>
        {invalidText}
      </Feedback>
    );
  }

  renderInput() {
    const {
      onChange, type, name,
      value, disabled, autoFocus,
      placeholder, maxLength,
      pattern,
    } = this.props;
    const { focus } = this.state;
    return (
      <Input
        type={type}
        onChange={onChange}
        onFocus={() => this.onFocus()}
        onBlur={e => this.onBlurInput(e)}
        ref={this.inputRef}
        focus={focus}
        name={name}
        pattern={pattern && pattern}
        defaultValue={value}
        disabled={disabled}
        maxLength={maxLength === -1 ? '' : maxLength}
        onKeyUp={e => this.onKeyUp(e)}
        onKeyDown={e => this.onKeyDown(e)}
        autoFocus={autoFocus}
        placeholder={placeholder}
      />
    );
  }

  render() {
    const {
      label, marginBottom,
      labelPaddingBottom, marginRight,
      margin, customStyle,
    } = this.props;
    return (
      <Wrapper
        marginBottom={marginBottom}
        marginRight={marginRight}
        margin={margin}
        style={customStyle}
      >
        {
          label && (
            <Label labelPaddingBottom={labelPaddingBottom}>
              {label}
            </Label>
          )
        }
        {this.renderInput()}
        {this.renderFormFeedback()}
      </Wrapper>
    );
  }
}

Form.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  type: PropTypes.string,
  isValid: PropTypes.bool.isRequired,
  invalidText: PropTypes.string.isRequired,
  onEnter: PropTypes.func,
  isAllowWhiteSpace: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  marginBottom: PropTypes.number,
  margin: PropTypes.string,
  labelPaddingBottom: PropTypes.number,
  marginRight: PropTypes.number,
  placeholder: PropTypes.string,
  maxLength: PropTypes.number,
  pattern: PropTypes.string,
  customStyle: PropTypes.objectOf(PropTypes.any),
};

Form.defaultProps = {
  label: '',
  onBlur: null,
  type: 'text',
  onEnter: null,
  isAllowWhiteSpace: true,
  name: '',
  value: '',
  disabled: false,
  autoFocus: false,
  marginBottom: 0,
  margin: '',
  labelPaddingBottom: 10,
  marginRight: 0,
  placeholder: '',
  maxLength: -1,
  pattern: '',
  customStyle: {},
};
