import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  height: ${props => `${props.height}px`};
  width: ${props => `${props.width}px`};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: ${props => (props.isDisable ? '#ccc' : '#fff')};
`;

const Content = styled.div`
  height: ${props => `${props.height}px`};
  width: ${props => `${props.width}px`};
  border-radius: ${props => `${props.borderRadius}px`};
  background: #315f25;
`;

export default class RadioButton extends Component {
  componentDidMount() {

  }

  render() {
    const {
      width, height, isChecked, onChange, isDisable,
    } = this.props;
    return (
      <Wrapper isDisable={isDisable} width={width} height={height} onClick={onChange && !isDisable ? onChange : null}>
        {
          isChecked
            ? <Content width={width / 3} height={height / 3} borderRadius={width / 6} />
            : null
        }
      </Wrapper>
    );
  }
}

RadioButton.defaultProps = {
  height: 18,
  width: 18,
  isChecked: false,
  onChange: null,
  isDisable: false,
};

RadioButton.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  isChecked: PropTypes.bool,
  onChange: PropTypes.func,
  isDisable: PropTypes.bool,
};
