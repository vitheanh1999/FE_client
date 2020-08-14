import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { images } from '../../theme';

const DescriptionInput = styled.textarea`
  width: 100%;
  resize: none;
  height: ${props => (props.isExpand ? '10em' : '5em')}; 
  background-color: ${props => (props.disabled ? '#61636175' : '#efefef')};
`;

const WrapperContent = styled.div`
  width: 100%;
  position: relative;
  margin-left: 1em;
  margin-right: 1em;
  box-sizing: border-box;
`;

const TextAreaWrapper = styled.div`
  height: ${props => (props.isExpand ? '10em' : '5em')};
  background-color: #efefef;
`;

const Icon = styled.img`
  width: 1em;
  position: absolute;
  bottom: 10px;
  right: 20px;
`;

class TextAreaWithTruncate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpand: false,
    };

    this.toggleStatus = this.toggleStatus.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  toggleStatus() {
    const { isExpand } = this.state;
    this.setState({
      isExpand: !isExpand,
    });
  }

  render() {
    const { isExpand } = this.state;
    const {
      value, onChange, onFocus, disabled,
    } = this.props;
    return (
      <WrapperContent>
        <TextAreaWrapper isExpand={isExpand}>
          <DescriptionInput
            onChange={e => onChange(e, 'description')}
            value={value}
            isExpand={isExpand}
            onFocus={onFocus}
            disabled={disabled}
          />
        </TextAreaWrapper>
        <Icon
          onClick={this.toggleStatus}
          src={
            isExpand
              ? images.iconDropDown.iconCloseDropDown
              : images.iconDropDown.iconOpenDropDown
          }
        />
      </WrapperContent>
    );
  }
}

TextAreaWithTruncate.defaultProps = {
  value: '',
  onFocus: () => { },
  disabled: false,
};

TextAreaWithTruncate.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
};

export default TextAreaWithTruncate;
