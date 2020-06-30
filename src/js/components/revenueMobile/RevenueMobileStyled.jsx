import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


export const Label = styled.span`
  margin-right: 3px;
  font-weight: normal;
  margin-left: 2px;
`;

export const StyledDatePicker = styled(DatePicker)`
  width: 7em !important;
`;

export const GcText = styled.span`
  color: ${props => (props.isRed ? 'red' : 'black')};
`;

export const Title = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  > span:first-child {
    font-weight: 700;
  }
`;

export const ChartArea = styled.div`
  margin-top: 1.5em;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ChartTitle = styled.div`
  font-size: 0.8em;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const Wrapper = styled.div`
  background-color: #fff;
  padding: 5%;
  margin-top: 1em;
`;

export const Notification = styled.span`
  margin-top: 1em;
  color: red;
  font-size: 0.6em;
  display: flex;
  justify-content: flex-end;
`;
