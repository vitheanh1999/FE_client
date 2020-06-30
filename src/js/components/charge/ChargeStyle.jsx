import styled from 'styled-components';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { isMobile } from 'react-device-detect';

export const WrapperDropDown = styled.div`
  font-size: 70%;
`;

export const ContentBody = styled.div`
  width: 100%;
  padding: 1em;
  overflow: auto;
  display: flex;
  flex-direction: column;
  background-color: #333;
  color: #fff;
  font-size: 1.1em;
  flex-shrink: 0;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  max-height: 90%;
`;

export const Button = styled.div`
  background-color: ${props => (props.backgroundColor ? props.backgroundColor : '#00647aad')};
  border-radius: 5px;
  min-height: 'fit-content';
  height: ${props => props.height};
  width: ${props => props.width};
  min-width: 5em;
  color: #fff;
  padding: 0.2em 0;
  text-align: center;
  cursor: ${props => (props.isDisabled ? 'no-drop' : 'pointer')};
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
`;

export const ChargeButton = styled.div`
  background-color: ${props => (props.isDisabled ? '#555' : '#00647aad')};
  border-radius: 5px;
  cursor: ${props => (props.isDisabled ? 'no-drop' : 'pointer')};
  height: fit-content;
  min-width: 8em;
  color: #fff;
  padding: 0.2em 0;
  text-align: center;
  font-weight: 700;
  font-size: 1em;
  align-self: center;
  user-select: none;
  margin-right: 0.5em;
`;

export const IconOnOff = styled.img`
  width: 1.75em;
  margin-right: 0.5em;
  margin-left: 0.5em;
`;

export const IconStatus = styled.img`
  width: 1em;
  margin-right: 0.2em;
`;

export const CheckBox = styled.img`
  width: 1em;
  height: 1em;
  margin: 0 0.5em;
`;

export const WrapperBotName = styled.div`
  word-break: break-all;
`;

export const WrapperTitleCharge = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.5em 2%;
  flex-direction: ${props => props.flexDirection};
  min-height: fit-content;
`;

export const WrapperContentCharge = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.5em 0;
  flex-direction: ${props => props.flexDirection};
  min-height: fit-content;
`;

export const WrapperBot = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0.5em 2%;
  height: 5em;
  border-bottom: solid 1px #c7c0b8;
  font-weight: 700;
  font-size: 90%;
  min-height: fit-content;
  background-color: ${props => (props.backgroundColor ? props.backgroundColor : 'unset')};

  &:hover {
    background-color: #555;
  }
`;

// export const ButtonStatus = styled.div`
//   width: 7em;
//   height: 1.7em;
//   background-color: ${props => (props.isOn ? '#31ae00' : '#d00000')};
//   border-radius: 0.25em;
//   color: #fff;
//   font-weight: 600;
//   font-size: 1.2em;
//   display: flex;
//   justify-content: center;
//   margin-right: 0.3em;
//   margin-bottom: 0.5em;
//   white-space: nowrap;
// `;
export const WrapperNotification = styled.div`
  padding-right: 0.5em;
`;

export const Label = styled.div`
  display: flex;
  word-break: break-all;
  align-items: center;
  align-self: ${props => (props.alignSelf ? props.alignSelf : 'flex-end')};
`;

export const Footer = styled.div`
  display: flex;
  height: 5em;
  padding: 0.5em 2%;
  justify-content: flex-end;
`;

export const ModalCustom = styled(Modal)`
  justify-content: center;
  font-size: ${props => props.fontSize}px;

  .modal-content {
    width: max-content;
  }
`;

export const ModalHeaderCustom = styled(ModalHeader)`
  background-color: #00647a;
  border-bottom: #00647a;
  color: #fff;
  height: 2.5em;
  padding: 0.5em;
  font-weight: 700;

  > button {
    font-size: 1em;
    color: #fff;
  }
`;

export const ModalBodyCustom = styled(ModalBody)`
  padding: 2em 3em;
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;

  > span {
    width: 100%;
    font-size: 99%;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 1em auto;
`;

export const InputStyle = styled.input`
  height: 2.38em;
  border-radius: 0.278em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding: 0.5em;
  border: 1px solid gray;
  width: 100%;

  ::placeholder {
    font-size: 0.8em;
    color: #6c757d99;
  }
`;

export const ErrorText = styled.span`
  color: red;
`;

export const TextCustom = styled.span`
  margin: ${props => props.margin};
  font-size: ${props => props.fontSize};
  font-weight: ${props => props.fontWeight};
  width: auto;
`;

export const InlineDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

export const WrapperTable = styled.div`
  background-color: rgb(75, 78, 75);
  min-height: fit-content;
  height: 33em;
  color: #fff;
  padding: 0.1em;
  font-size: 0.8em;
  margin-bottom: 1.5em;
`;

export const Table = styled.table`
  width: ${props => props.width};
  white-space: nowrap;
`;

export const Row = styled.tr`
  background-color: ${props => (props.backgroundColor ? props.backgroundColor : '#333')};
  font-weight: 500;
  height: 2.5em;
`;

export const RowHead = styled.tr`
  background-color: #333;
  text-transform: uppercase;
  font-weight: 700;
  white-space: nowrap;
  height: 3.25em;
`;

export const Cell = styled.td`
  padding: 0.5em;
  text-align: ${props => (props.textAlign ? props.textAlign : 'center')};
  border-right: ${props => (props.borderRight ? props.borderRight : '1px solid #aaa')};
  height: 3em;
`;

export const WrapperTabMenu = styled.div`
  width: 100%;
`;

export const WrapperLoading = styled.div`
  flex: 1;
  position: absolute;
`;

export const Span = styled.span`
  display: flex;
  align-items: center;
`;

export const Img = styled.img`
  margin-left: 5px;
`;

export const TitleHead = styled.div`
  font-size: ${isMobile ? 0.75 :1}em;
`;
