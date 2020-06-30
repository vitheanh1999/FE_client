import styled from 'styled-components';
import images from '../../theme/images';

export const Wrapper = styled.div`
  background-color: #333;
  position: absolute;
  z-index: 1;
  height: 100vh;
  width: 100vw;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  overflow: scroll;
  display: flex;
  flex-direction: column;
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: ${props => props.height}em;
  justify-content: flex-start;
  align-items: center;
  padding-left: ${props => props.left || 0}em;
`;

export const DivCenter = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ImgUser = styled.div`
  width: ${props => props.scale * 17}px;
  height: ${props => props.scale * 19}px;
  background-image: url(${images.UserIconSprite});
  cursor: pointer;
  background-size: 100% 100%;
`;

export const ImgMoney = styled.div`
  width: ${props => props.scale * 17}px;
  height: ${props => props.scale * 17}px;
  background-image: url(${props => props.icon});
  background-size: cover;
  cursor: pointer;
`;

export const ButtonClose = styled.img`
  height: 1.3em;
  display: flex;
  align-self: flex-end;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`;

export const Icon = styled.img`
  width: ${props => props.width}em;
  height: ${props => props.height}em;
  filter: opacity(0.5);
`;

export const TextName = styled.span`
  margin-left: ${props => props.left}em;
  color: ${props => props.color};
  font-weight: bold;
`;
