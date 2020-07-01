import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const BodyContent = styled.div`
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  background-color: #333;
  color: #fff;
  margin-bottom: 1em;
  padding-top: 1em;
  padding-bottom: 1em;
`;

export const WrapperTimeUpdate = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-left: 1em;
  margin-right: 1em;
`;

export const Table = styled.div`
  white-space: nowrap;
  color: rgba(255, 255, 255, 0.9);
  font-size: 82.5%;
  max-width: 100%;
  border-radius: 3px;
  display: flex;
  flex-direction: row;
  border: 1px solid rgb(102, 102, 102);
  overflow-x: auto;
  margin-bottom: 1em;
  margin-left: auto;
  margin-right: auto;
  min-height: fit-content;
`;

export const Column = styled.div`
  font-weight: 500;
  display: flex;
  flex-direction: column;
  width: ${props => (props.width ? props.width : '100')}%;
  min-height: fit-content;
  min-width: fit-content;
`;


export const Cell = styled.div`
  padding: 0.5em;
  min-height: 2.75em;
  color: ${props => (props.color)};
  border-right: ${props => (props.borderRight ? props.borderRight : '1px solid rgb(102, 102, 102)')};
  background-color: ${props => (props.backgroundColor ? props.backgroundColor : '#fff')};
  display: flex;
  justify-content: ${props => props.justifyContent || 'center'};
  min-width: fit-content;
`;

export const CellHeader = styled(Cell)`
  color: #222;
  background-color: #999;
  text-transform: uppercase;
  min-width: fit-content;
`;

export const DatePickerCustom = styled(DatePicker)`
  max-width: 7em !important;
  border-radius: 2px;
  border: 1px solid #aeaeae;
  padding-left: 0.25em;
  margin: 0 0.35em;
`;

export const WrapperDatePicker = styled.div`
  width: 92%;
  display: ${props => (props.isMobile ? props.isMobile : 'flex')};
  justify-content: space-between;
  font-size: 80%;
  margin-left: auto;
  margin-right: auto;
  white-space: nowrap;
  margin-bottom: 1em;
  align-items: center;
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

export const NoDataDiv = styled.div`
  width: 100%;
  height: 4em;
  text-align: center;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const WrapperDropDown = styled.div`
  font-size: 70%;
`;

export const ButtonDetail = styled.div`
  min-width: fit-content;
  max-width: 10em;
  padding: 0 0.5em;
  background-color: #00647a;
  border-radius: 3px;
  text-align: center;
  color: #fff;
  text-transform: capitalize;
  cursor: pointer;
`;

export const WrapperChart = styled.div`
  max-height: 30em;
  padding: 1em;
  background-color: #333;
  color: #fff;
  margin: 1em;
  border-radius: 3px;
`;

export const WrapperLineLabel = styled.div`
  width: 92%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ScrollPart = styled.div`
  white-space: normal;
  overflow-x: auto;
  max-width: 100%;
  width: ${props => props.width}%;
  display: flex;
  flex-direction: row;
  min-height: fit-content;
`;

export const ListColor = [
  '#2d889c',
  'red',
  'green',
  'orange',
  '#f4a460',
  '#2e8b57',
  '#a0522d',
  '#c0c0c0',
  '#87ceeb',
  '#6a5acd',
  '#708090',
  '#00ff7f',
  '#4682b4',
  '#d2b48c',
  '#008080',
  '#d8bfd8',
  '#ff6347',
  '#40e0d0',
  '#ee82ee',
  '#f5deb3',
  '#ffff00',
  '#9acd32',
];

export const TitleChart = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

export const Icon = styled.img`
  width: 1.5em;
`;

export const Blank = styled.div`
  width: ${props => props.width}em;
  height: ${props => props.height}em;
`;

export const Text = styled.span`
  font-size: 0.8em;
  color: #09f51c;
  margin-left: ${props => props.left}em;
`;
