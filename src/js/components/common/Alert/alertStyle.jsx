import styled, { keyframes } from 'styled-components';
// import { is,Mobile } from 'react-device-detect';

const isMobile = false;
const rotate = keyframes`
  from {
    transform: scale(0.5, 0.5);
  }

  to {
    transform: scale(1, 1);
  }
`;

export const Wrapper = styled.div`
  display: flex;
  position: fixed;
  z-index: 999999;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translate3d(0, 0, 0);
  background-color: rgba(10, 10, 10, 0.29);
  font-size: ${isMobile ? '1rem' : 'inherit'};
`;

export const AlertStyled = styled.div`
  position: relative;
  padding: 1.9em 0;
  min-width: 25%;
  max-width: ${props => props.maxWidth || '80%'};
  background-color: #000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  border: 0.1em solid  rgb(128, 128, 128);
  border-radius: 0.3em;
  width: ${props => props.width};
  animation: ${props => props.isAnimation && rotate} 0.5s;
`;

export const CloseButton = styled.img`
  height: 0.8em;
  width: 0.8em !important;
  right: 1.3em;
  top: 1.3em;
  cursor: pointer;
  position: absolute;
  user-select: none;
`;

export const Content = styled.div`
  line-height: 1.9em;
  user-select: none;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
  padding: ${props => (props.padding ? props.padding : 1.9)}em;
`;

export const Title = styled.p`
  color: white;
  text-transform: uppercase;
  font-size: ${props => props.fontSize || 1.5}em;
  font-weight: 600;
  display: flex;
  justify-content: center;
  user-select: none;
`;

export const Message = styled.p`
  color: white;
  white-space: ${props => props.whiteSpace || 'pre-wrap'};
  text-align: center;
  padding: 0;
  font-size: ${props => props.fontSize || 1}em;
  font-weight: ${props => props.fontWeight};
`;

export const ButtonWrapper = styled.div`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  display: flex;
  width: 100%;
`;

export const Button = styled.button`
  outline: none;
  width: 40%;
  height: 3.3em;
  text-transform: uppercase;
  color: white;
  border: 0;
  border-radius: 0.3em;
  cursor: pointer;
  font-size: 1.1em;
  font-weight: 600;
  user-select: none;
  background-color: ${props => props.bgColor};
`;
