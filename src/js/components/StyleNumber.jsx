import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  color: ${props => props.color};
  width: auto;
  height: auto;
  display: flex;
  align-items: baseline;
`;

const WrapperInt = styled.div`
  font-size: 100%;
  width: auto;
  height: auto;
`;
const WrapperFloat = styled.div`
  font-size: 75%;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
`;
class StyleNumber extends Component {
  constructor(props) {
    super(props);
    this.conventNumberFloat = this.conventNumberFloat.bind(this);
    this.renderCaseNumberFloat = this.renderCaseNumberFloat.bind(this);
    this.renderCaseNumberInt = this.renderCaseNumberInt.bind(this);
  }

  conventNumberFloat(num, afterDot) {
    if (num === undefined) return false;
    const numToString = num.toString();
    const extract = numToString.split('.');
    let suffix = '';
    if (extract.length > 1) {
      suffix = extract[1];
    }
    suffix = suffix.substr(0, afterDot);
    suffix = this.padLeft(suffix, afterDot);
    return suffix;
  }

  padLeft(number, length) {
    const str = String(number);
    if (str.length >= length) return str;
    return number + Array(length - str.length + 1).join('0');
  }

  renderCaseNumberFloat() {
    const { value, afterDot } = this.props;
    const numberInt = parseInt(value, 10);
    return (
      <React.Fragment>
        <WrapperInt>{numberInt.toLocaleString('ja')}</WrapperInt>.
        <WrapperFloat>{this.conventNumberFloat(value, afterDot)}</WrapperFloat>
      </React.Fragment>
    );
  }

  renderCaseNumberInt() {
    const { value } = this.props;
    const numberInt = parseInt(value, 10);
    return (
      <React.Fragment>
        <WrapperInt>{numberInt.toLocaleString('ja')}</WrapperInt>.<WrapperFloat><p>00</p></WrapperFloat>
      </React.Fragment>
    );
  }


  render() {
    const { value, color } = this.props;
    return (
      <Wrapper
        id="number"
        color={color}
      >
        {Number.isInteger(value) ? this.renderCaseNumberInt() : this.renderCaseNumberFloat()}
      </Wrapper>
    );
  }
}
StyleNumber.propTypes = {
  value: PropTypes.number.isRequired,
  afterDot: PropTypes.number,
  color: PropTypes.string,
};
StyleNumber.defaultProps = {
  afterDot: 2,
  color: '#fff',
};

export default StyleNumber;
