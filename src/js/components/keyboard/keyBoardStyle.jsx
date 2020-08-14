import styled from 'styled-components';

export const PanelRoot = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${props => props.height};
  background-color: black;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9000;
  font-size: ${props => props.fontSize}px;
`;

export const Wrapper = styled.div`
  height: 100%;
  background-color: wheat;
  display: flex;
  flex-direction: column;
  width: ${props => props.width};
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex: ${props => props.flex};
  width: 100%;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${props => props.flex};
`;

export const WrapperContent = styled.div`
  display: flex;
  height: 100%;
`;
