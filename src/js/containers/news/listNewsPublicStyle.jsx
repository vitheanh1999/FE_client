import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  position: absolute;
  align-items: center;
  top: 1em;
  right: 1em;
  background-color: ${props => (props.isShowAll ? '#000000c2' : '0000')};
  width: ${props => props.width}em;
  min-height: ${props => props.height}em;
  max-height: 30%;
  border-radius: 1em;
  flex-direction: column;
  justify-content: flex-start;
`;

export const WrapperFull = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  justify-content: flex-start;
`;

export const Blank = styled.div`
  width: ${props => props.width}em;
  height: ${props => props.height}em;
`;

export const Title = styled.div`
  width: 80%;
  font-size: 1.2em;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

export const WrapperContent = styled.div`
  width: calc(100% - 1em);
  flex: 1;
  overflow: auto;
  overflow-y: overlay;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 0.5em;
  padding-right: 0.5em;
`;

export const WrapperAll = styled.div`
  width: 100%;
  display: flex;
  flex: 1;
  overflow: auto;
  overflow-y: overlay;
  flex-direction: column;
  align-items: center;
  padding-left: 0.5em;
  padding-right: 0.5em;
  height: 100%;
  background-color: #333;
`;

export const ListNews = styled.div`
  width: 100%;
  overflow: auto;
  color: white;
  padding: 0.5em;
`;
