import styled from 'styled-components';
import images from '../../../../assets/lucImage';

export const Wrapper = styled.div`
  display: flex;
  position: absolute;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  left: 0;
  top: 0;
  overflow: hidden;
`;

export const VideoArea = styled.div`
  position: absolute;
  visibility: ${props => (props.isTurnOnVideo ? 'visible' : 'hidden')};
  width: ${props => props.scale * 497}px;
  height: ${props => props.scale * 410}px;
  background: url(${images.VideoBackground});
`;

export const LoadingLogo = styled.div`
  position: absolute;
  width: ${props => props.scale * 183}px;
  height: ${props => props.scale * 78}px;
  top: ${props => props.scale * 177}px;
  left: ${props => props.scale * 157}px;
  background: url(${images.VideoLoadingLogo});
  background-size: 100% 100%;
  z-index: 0;
`;

export const DarkBackground = styled.div`
  position: absolute;
  top: 0;
  width: ${props => props.scale * 502}px;
  height: ${props => props.scale * 414}px;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const PauseVideoBackground = styled(DarkBackground)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const DisconnectText = styled.div`
  color: white;
  position: absolute;
  bottom: ${props => props.scale * 80}px;
  left: ${props => props.scale * 29}px;
  width: ${props => props.scale * 450}px;
  // height: ${props => props.scale * 30}px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.scale * 16}px;
  text-align: center;
  white-space: pre;
`;

export const VideoContainer = styled.div`
  width: ${props => props.scale * 490}px;
  height: ${props => (props.scale * 402)}px;
  border: solid ${props => (props.scale * 6)}px #c2ac86;
  overflow: hidden;
  z-index: 0 !important;
  position: absolute;
  left: 0;
  right: 0;
  box-sizing: content-box;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
`;

export const BackGroundTurnOffVideo = styled.div`
  visibility: ${props => (props.isTurnOnVideo ? 'hidden' : 'visible')};
  position: absolute;
  top: 0;
  left: 0;
  width: ${props => props.scale * 490}px;
  height: ${props => props.scale * 402}px;
  border: solid ${props => props.scale * 6}px #c2ac86;
  background: url(${images.VideoBackground});
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: content-box;
`;

export const ButtonPlayVideo = styled.button`
  margin-top: ${props => props.scale * 10}px;
  text-transform: uppercase;
  background-color: green;
  font-size: ${props => props.scale * 12}px;
  color: #fff;
  border: none;
  border-radius: ${props => props.scale * 3}px;
  font-weight: bold;
  width: ${props => props.scale * 106}px;
  height: ${props => props.scale * 20}px;
  cursor: pointer;
  z-index: 10;
`;

export const IconLive = styled.div`
  position: absolute;
  width: ${props => props.scale * 50}px;
  height: ${props => props.scale * 19}px;
  background-image: url(${images.icLive});
  top: ${props => props.scale * 27}px;
  left: ${props => props.scale * 432}px;
  background-size: cover;
  z-index: 10;
`;

export const MaxBandwidth = 440000;

export const NetworkStatus = styled.div`
  position: absolute;
  display: ${props => (props.showLoading || !props.isTurnOnVideo ? 'none' : 'flex')};
  flex-direction: column;
  text-align: left;
  top: ${props => props.scale * 28}px;
  left: ${props => props.scale * 349}px;
  z-index: 10;
  transform: rotate(-90deg);
  filter: brightness(200%);

  .network-column {
    height: ${props => props.scale * 2}px;
    margin-bottom: ${props => props.scale * 2}px;
  }

  #first-column {
    width: ${props => props.scale * 3}px;
    background-color: green;
  }

  #second-column {
    width: ${props => props.scale * 6}px;
    background-color: ${props => (props.bandwidth > (0.2 * MaxBandwidth) ? 'green' : '#dddd')};
  }

  #third-column {
    width: ${props => props.scale * 9}px;
    background-color: ${props => (props.bandwidth > (0.4 * MaxBandwidth) ? 'green' : '#dddd')};
  }

  #fourth-column {
    width: ${props => props.scale * 12}px;
    background-color: ${props => (props.bandwidth > (0.6 * MaxBandwidth) ? 'green' : '#dddd')};
  }

  #fifth-column {
    width: ${props => props.scale * 15}px;
    background-color: ${props => (props.bandwidth > (0.8 * MaxBandwidth) ? 'green' : '#dddd')};
  }
`;
