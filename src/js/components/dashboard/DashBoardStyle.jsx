import styled from 'styled-components';

export const WrapperQuickView = styled.div`
  margin: 0;
  width: ${props => (props.portrait ? '100%' : 'calc(50% - 1em)')};
  margin-left: auto;
  margin-right: auto;
`;

export const Blank = styled.div`
  width: ${props => props.width}em;
  height: ${props => props.height}em;
`;

export const WrapperContent = styled.div`
  display: flex;
  flex-direction: ${props => (props.flexDirection ? props.flexDirection : 'row')};
  width: 100%;
  padding: 0 2em;
  box-sizing: border-box;
`;

export const BodyContent = styled.div`
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #333;
  color: #fff;
  margin-bottom: 1em;
  padding-top: 1em;
  padding-bottom: 1em;
  min-height: 30em;
  max-height: 70vh;
  overflow-y: auto;
  height: ${props => (props.height)};
`;

export const WrapperBot = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const WrapperTimeUpdate = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Wrapper = styled.div`
  padding: 0.5em 2%;
  margin: 0.5em 1em;
  overflow: hidden;
  background-color: ${props => (props.backgroundColor)};
  border-radius: 3px;
  height: 100%;
`;

export const Img = styled.img`
  width: 1em;
  margin: 0 0.25em 0.25em 0.65em;
  vertical-align: middle;
  cursor: pointer;
`;

export const SpanRed = styled.div`
  font-weight: 550;
  font-size: ${props => props.size || 0.9}em;
  color: #ff5a5a;
  white-space: pre-wrap;
  display: flex;
  justify-content: space-between;
  margin-left: ${props => props.marginLeft}em;
  margin-top: ${props => props.marginTop}em;
  width: ${props => props.isMobile && '50%'};
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow-y: auto;
  min-height: fit-content;
`;

export const ContentContainer = styled.div`
  margin-left: auto;
  margin-right: auto;
`;
