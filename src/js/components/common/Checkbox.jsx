import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: ${props => props.marginTop || '10px'};
  align-items: center;
`;

const Label = styled.div`
  color: white;
  font-size: ${props => props.fontSize || '14px'};
  margin-left: 10px;
`;

const Input = styled.input`
  height: ${props => props.height};
  width: ${props => props.width};
  align-self: center;
`;

export default class Checkbox extends Component {
  componentDidMount() {

  }

  render() {
    const {
      width,
      height,
      label,
      onChange,
      fontSize,
      marginTop,
    } = this.props;
    return (
      <Wrapper marginTop={marginTop}>
        <Input width={width} height={height} type="checkbox" onChange={onChange} />
        <Label fontSize={fontSize}>{label}</Label>
      </Wrapper>
    );
  }
}

Checkbox.defaultProps = {
  marginTop: null,
  fontSize: null,
  height: '18px',
  width: '18px',
  label: null,
  onChange: null,
};

Checkbox.propTypes = {
  marginTop: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  label: PropTypes.objectOf(PropTypes.any),
  onChange: PropTypes.func,
  fontSize: PropTypes.string,
};
