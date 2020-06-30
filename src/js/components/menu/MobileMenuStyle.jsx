import styled from 'styled-components';
import { colors } from '../../theme';

export const WrapperMenu = styled.div`
  background-color: rgb(0, 46, 56);
  // min-height: fit-content;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  color: rgba(255, 255, 255, 0.4);
  z-index: 1;
  position: absolute;
  font-size: ${props => props.fontSize}px;
  overflow: auto;
`;
export const WrapperTabItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  background: ${props => (props.isSelected ? 'linear-gradient(to right, #f9f3f300 0%, #ffffff66 50%, #f9f3f300 100%);' : 'unset')};
  width: 95%;
  border-radius: 3px;
  margin-left: auto;
  margin-right: auto;
`;

export const TabItem = styled.div`
  width: 100%;
  height: 5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.25em;
  margin: 0.5em;
  cursor: pointer;
  font-weight: bold;
  color: ${props => (props.isSelected ? colors.secondary : 'white')};
`;

export const TabTriangle = styled.div`
  border-top: 0.75em solid transparent;
  border-bottom: 0.75em solid transparent;
  border-right: 0.75em solid #252525;
`;

export const LogoWrapper = styled.div`
  background-color: rgba(255, 255, 255, 0.5);
  width: 100%;
  height: 7em;
  display: flex;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  padding-right: 0.5em;
  padding-left: 0.5em;
  margin-bottom: 1em;
  justify-content: center;
`;

export const Logo = styled.img`
  width: 11em;
`;

export const Img = styled.img`
  width: ${props => (props.width ? props.width : '3.5em')};
  align-self: ${props => (props.alignSelf ? props.alignSelf : 'unset')};
`;

export const CloseIcon = styled.img`
  width: ${props => (props.width ? props.width : '3.5em')};
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`;
