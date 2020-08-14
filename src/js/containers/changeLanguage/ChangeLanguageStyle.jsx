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
    background-color: #1f1f1f;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border: 0.1em solid  rgb(128, 128, 128);
    border-radius: 0.5em;
    animation: ${props => props.isAnimation && rotate} 0.5s;
    width: 35em;
    font-size: ${props => props.fontSize}px;
`;

export const CloseButton = styled.img`
    height: 1em;
    width: 1em !important;
    right: 1.3em;
    top: 1.3em;
    cursor: pointer;
    position: absolute;
    user-select: none;
`;

export const Title = styled.p`
    color: white;
    text-transform: uppercase;
    font-size: 1.5em;
    font-weight: 600;
    display: flex;
    justify-content: center;
    user-select: none;
`;

export const WrapperFlag = styled.div`
    display:flex;
    justify-content: space-around;
    padding: 2em 1em;
    text-align: center;
`;

export const Flag = styled.div`
  
`;

export const ImageFlag = styled.img`
    width: 15em;
    border-radius: 1em;
    :hover {
      border: 2px solid yellow;
    }
    ${props => (props.isActived ? 'border: 5px solid green;' : '')}
`;

export const NameFlag = styled.p`
    color: white;
`;

export const ButtonSelect = styled.div`
    cursor: pointer;
    color: white;
    text-align: center;
    background-color: #105463;
    align-self: center;
    border-radius: 6px;
    padding: 0.3em 1.7em;
    font-weight: 600;
    text-transform: uppercase;
`;
