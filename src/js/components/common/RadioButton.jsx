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
  background: white;
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
      width, height, isChecked, onChange,
    } = this.props;
    if (onChange) {
      return (
        <Wrapper width={width} height={height} onClick={onChange}>
          {
            isChecked
              ? <Content width={width / 3} height={height / 3} borderRadius={width / 6} />
              : null
          }
        </Wrapper>
      );
    }
    return (
      <Wrapper width={width} height={height}>
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
};

RadioButton.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  isChecked: PropTypes.bool,
  onChange: PropTypes.func,
};
