import styled from 'styled-components';

export const ResultContent = styled.div`
  color: ${props => (props.isWin ? '#f5f3b3' : ' #ffffff')};
  border-radius: 5px;
  border-style: solid;
  border-width: 2px;
`;

export const IconChip = styled.img`
  width: 15px;
  height: 15px;
  margin-right: 5px;
`;

export const ActionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: absolute;
  top: ${props => props.top};
  opacity: ${props => props.opacity};
  left: 0;
  right: 0;
  width: 1060px;
  height: 336px;
  z-index: 10;
  transform: scale(${props => props.scale});
  transform-origin: 0% 0%;
`;

export const BackgroundContact = styled.div`
  width: 1060px;
  height: 336px;
  background: #111;
  opacity: 0.6;
  position: absolute;
`;

export const Image = styled.img`
  width: 107px;
  height: 142px;
  transform: ${props => props.run};
  margin-left: 5px;
  margin-top: 40px;
  user-select: none;
  pointer-events: none;
`;

export const ImageRight = styled.img`
  width: 107px;
  height: 142px;
  transform: ${props => props.run};
  margin-right: 25px;
  margin-top: 40px;
  user-select: none;
  pointer-events: none;
`;

export const Image1 = styled.img`
  width: 107px;
  height: 142px;
  transform: rotate(90deg) ${props => props.run};
  user-select: none;
  pointer-events: none;
`;

export const ImageWin = styled.img`
  ${props => (props.tie ? '' : 'width: 400px')};
  height: 47px;
  position: absolute;
  margin-left: ${props => props.x};
  margin-top: ${props => (props.tie ? '87px' : '93px')};
  user-select: none;
  pointer-events: none;
  z-index: 2;
`;

export const Image2 = styled.img`
  width: 107px;
  height: 142px;
  transform: ${props => props.run};
  margin-left: ${props => props.x};
  margin-top: 40px;
  user-select: none;
  pointer-events: none;
`;

export const DivZero = styled.div`
  z-index: 1;
  width: 371px;
  height: 336px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const DivOne = styled.div`
  z-index: 1;
  width: 371px;
  height: 336px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
`;

export const Image4 = styled.img`
  width: 107px;
  height: 142px;
  transform: ${props => props.run};
  margin-right: 5px;
  margin-top: 40px;
  user-select: none;
  pointer-events: none;
`;

export const Wrapper = styled.div`
  display: flex;
  width: 530px;
  height: 336px;
`;

export const WrapperPlayer = styled.div`
  width: 159px;
  height: 336px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: flex-start;
  padding-top: 58px;
`;
export const WrapperBanker = styled.div`
  width: 159px;
  height: 336px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
  padding-top: 58px;
`;

export const CenterLogo = styled.div`
  position: absolute;
  width: 78px;
  height: 78px;
  color: #ffffffc7;
  background-color: ${props => props.colors.background};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 51px;
  font-weight: bolder;
  left: 488px;
  top: 35px;
  border-width: 3px;
  border-style: solid;
  border-color: ${props => props.colors.border};
  z-index: 3;
`;

export const ResultMessage = styled.div`
  position: absolute;
  width: 211px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 18px;
  left: 419px;
  top: 130px;
  padding-top: 6px;
  padding-bottom: 6px;
`;

export const Crown = styled.img`
  width: 41px;
  height: 32px;
  position: absolute;
  left: 510px;
  top: 4px;
`;

export const ResultBackground = styled.div`
  justify-content: center;
  display: flex;
`;

export const ColorResult = {
  BankerWin: {
    background: '#d90000',
    border: '#ff6b6b',
  },
  PlayerWin: {
    background: '#0031d9',
    border: '#6b6dff',
  },
  Tie: {
    background: '#56d900',
    border: '#8dff6b',
  },
};
