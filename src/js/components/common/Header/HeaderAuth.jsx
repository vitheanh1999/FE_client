import React, { Component } from 'react';
import styled from 'styled-components';
import { images } from '../../../theme';

const Wrapper = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  background: linear-gradient(#333, #121212);
`;

const Logo = styled.img`
  float: left;
  background: linear-gradient(#333, #121212);
  width: 90px;
  height: 90px;
`;

const StyledLogo = styled.div`
  float: left;
  width: 90px;
  height: 90px;
  z-index: 2;
  margin-left: -3px;
  display: flex;
  align-items: center;
`;

export const StyledNotice = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  z-index: 1;
  overflow: hidden;

  @keyframes notice {
    0% {
      transform: translateX(1100px);
    }

    100% {
      transform: translateX(-900px);
    }
  }
`;

class HeaderAuth extends Component {
  componentDidMount() { }

  render() {
    return (
      <Wrapper>
        <StyledNotice className="notice">
          <StyledLogo>
            <a href="https://luc888.co/"><Logo src={images.logo} alt="" /></a>
          </StyledLogo>
        </StyledNotice>
      </Wrapper>
    );
  }
}

export default HeaderAuth;
