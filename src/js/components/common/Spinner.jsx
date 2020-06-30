import React, { Component } from 'react';
import styled from 'styled-components';
import Proptypes from 'prop-types';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
`;
const SpinnerStyle = styled.i`
  color: #fff;
`;

class Spinner extends Component {
  componentDidMount() {

  }

  render() {
    if (this.props.isLoading) {
      return (
        <Wrapper>
          <SpinnerStyle className="fa fa-spinner fa-spin fa-5x" />
        </Wrapper>
      );
    }
    return null;
  }
}

Spinner.defaultProps = {
  isLoading: false,
};

Spinner.propTypes = {
  isLoading: Proptypes.bool,
};

export default Spinner;
