import styled from 'styled-components';
import { Tooltip } from 'reactstrap';

export const ContentWrapper = styled.div`
  padding: 5%;
  background-color: #fff;
  margin-top: 1em;
`;

export const Notifi = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5em;
  width: 100%;
  border: 2px solid #89bcc7;
  word-break: break-word;
  white-space: pre-wrap;
`;

export const GcText = styled.span`
  color: ${props => (props.isRed ? 'red' : 'black')};
`;

export const NotiWrapper = styled.div`
  display: flex;
  width: 100%;
`;

export const LineChartOptions = {
  title: {
    display: false,
    position: 'bottom',
    fontSize: 17,
    fontColor: '#000',
  },
  legend: {
    display: false,
  },
  scales: {
    yAxes: [{
      scaleLabel: {
        display: false,
      },
    }],
  },
};

export const ChartArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

export const Container = styled.div`
  width: 100%;
  background-color: #dee3e4;
  margin-top: 1em;
`;

export const TitleStyled = styled.div`
  width: 100%;
  position: relative;
  text-align: center;

  #toggle-icon {
    width: 0.9em;
    cursor: pointer;
  }
`;

export const TitleWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1em;
  font-weight: bold;
`;

export const WrapperKeyStyled = styled.div`
  display: flex;
  margin-bottom: 0.5em;
  align-items: center;
  overflow: auto;

  #key-name {
    font-weight: 500;
    font-size: 1em;
  }
`;

export const BotStatusBtnStyled = styled.img`
  width: 3em;
  margin-right: 0.5em;
`;

export const StatusImgStyled = styled.img`
  height: 100%;
`;

export const DepositContentStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  font-size: 1.1em;
  font-weight: bold;
  position: relative;
  background-color: #fff;
`;

export const DepositStatusesBtn = styled.img`
  width: 10%;
  margin-right: 2%;
`;

export const WrapperBurstStatusBtn = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const InformationImgStyled = styled.img`
  width: 1.5em;
  cursor: pointer;
`;

export const ImageStyled = styled.img`
  position: absolute;
  right: 0;
`;

export const DivFullHeight = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const SpanLastUpdate = styled.span`
  margin-top: 0.5em;
  display: flex;
  color: red;
  justify-content: flex-end;
  font-size: 0.6em;
`;

export const TooltipCustom = styled(Tooltip)`
  .tooltip-inner {
    max-width: 12em;
  }
`;

export const ListBotWrapper = styled.div`
  margin-top: 0.5em;
  height: 50vw;
  overflow: auto;
`;

export const OnOffBotStatus = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NumberBotOn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NumberBotOff = styled(NumberBotOn)`
  margin-top: 1em;
`;

export const NumberBotWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StatusBot = styled.div`
  display: flex;
  align-items: center;
  margin-right: 0.7em;
  height: 1em;
`;
