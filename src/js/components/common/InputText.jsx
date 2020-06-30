import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import i18n from '../../i18n/i18n';

const Title = styled.div`
  margin-right: 1em;
`;

const Wrapper = styled.div`
  margin: ${props => (props.margin && props.margin)};
`;

const WrapperContent = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: ${props => props.isFlexColumn && 'column'};
`;

const Message = styled.div`
  font-size: 0.4em;
  color: red;
  text-align: ${props => (props.isFlexColumn ? '' : 'end')};
`;

const Input = styled.input`
  font-size: 1em;
  height: 2em;
  border-radius: 0.13334em;
  padding: 0.5em;
  width: ${props => (props.width && props.width)}em;
`;

class InputText extends Component {
  constructor(props) {
    super(props);
    const { value } = this.props;
    this.state = {
      value,
      isMaxSize: false,
      isMinSize: false,
    };
  }

  onChange(event) {
    const {
      maxSize, minSize,
      index, handleChangeInput,
    } = this.props;
    const { isMaxSize, isMinSize } = this.state;
    const { value } = event.target;
    if (value.length > maxSize) {
      if (!isMaxSize) this.setState({ isMaxSize: true });
    } else {
      if (isMaxSize) {
        this.setState({ isMaxSize: false });
      }
      this.setState({ value });
      handleChangeInput(value, index);
    }
    if (value.length < minSize) {
      if (!isMinSize) this.setState({ isMinSize: true });
    } else if (isMinSize) {
      this.setState({ isMinSize: false });
    }
  }

  handelBlur() {
    const { handleChangeInput, index, minSize } = this.props;
    const { isMinSize, isMaxSize, value } = this.state;
    if (value.length < minSize) {
      if (!isMinSize) this.setState({ isMinSize: true });
      if (isMaxSize) this.setState({ isMaxSize: false });
      document.getElementById('input').focus();
    } else {
      handleChangeInput(value, index);
    }
  }

  render() {
    const {
      maxSize, margin, isFlexColumn,
      title, height, width,
      isError, errorMessage,
    } = this.props;
    const { value, isMaxSize, isMinSize } = this.state;
    const showError = (!isMaxSize && !isMinSize) ? isError : false;
    return (
      <Wrapper height={height} width={width} margin={margin}>
        <WrapperContent isFlexColumn={isFlexColumn}>
          {
            title
              ? (
                <Title>
                  <span>{title}</span>
                </Title>
              ) : ''
          }
          <Input
            id="input"
            type="text"
            value={value || ''}
            placeholder=""
            onChange={e => this.onChange(e)}
            onBlur={() => this.handelBlur()}
            autoComplete="something-unsupported"
            width={width}
          />
        </WrapperContent>
        {isMaxSize ? (<Message isFlexColumn={isFlexColumn}>{i18n.t('txtFieldMaxSize').concat(maxSize)}</Message>) : ''}
        {isMinSize ? (<Message isFlexColumn={isFlexColumn}>{i18n.t('txtFieldMinSize')}</Message>) : ''}
        {showError ? (<Message isFlexColumn={isFlexColumn}>{errorMessage}</Message>) : ''}
      </Wrapper>
    );
  }
}

InputText.propTypes = {
  isFlexColumn: PropTypes.bool,
  title: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  value: PropTypes.string,
  maxSize: PropTypes.number,
  minSize: PropTypes.number,
  handleChangeInput: PropTypes.func.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  margin: PropTypes.string.isRequired,
  isError: PropTypes.bool.isRequired,
  errorMessage: PropTypes.string.isRequired,
};

InputText.defaultProps = {
  value: '',
  maxSize: 20,
  minSize: 6,
  isFlexColumn: false,
};

export default InputText;
