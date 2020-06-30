import styled from 'styled-components';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

export const Wrapper = styled.div`
  padding: 1.111em 2em;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  min-width: 26em;
`;

export const WrapperLi = styled.div`
  font-size: ${props => (props.fontSize ? props.fontSize : '1.1em')};
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  width: ${props => (props.width ? props.width : '25%')};
`;

export const KeyName = styled.div`
  display: ${props => (props.display ? props.display : 'flex')};
  align-items: center;
`;

export const WrapperUl = styled.div`
  padding: 1em 2%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${props => (props.height ? props.height : '7em')};
  border-bottom: solid 1px #c7c0b8;
  background-color: ${props => (props.isOffMin ? '#f4dbdb4f' : '#fff')};

  &:hover {
    background-color: ${props => (props.isOffMin ? '#f4dbdb80' : '#f4f3f2')};
  }
`;

export const WrapperHeader = styled.div`
  padding: 1em 2%;
  width: 100%;
  display: flex;
  font-weight: 900;
  font-size: ${props => (props.fontSize ? props.fontSize : '1.2em')};
  justify-content: space-between;
  align-items: center;
  height: 3em;
  border-bottom: solid 1px #c7c0b8;
  background-color: #2db7f5;
`;

export const WrapperList = styled.div`
  cursor: pointer;
  border-radius: 0.25em;
  background: white;
`;

export const KeyNameText = styled.p`
  margin-left: 0.5em;
  font-size: 1.1em;
  font-weight: 700;
  margin-bottom: 0 !important;
`;

export const ButtonCore = styled.div`
  cursor: pointer;
  width: ${props => props.width && props.width};
  height: ${props => props.height && props.height};
  font-size: ${props => props.fontSize && props.fontSize};
  margin: ${props => props.margin && props.margin};
  padding: ${props => props.padding && props.padding};
  background-color: ${props => (props.color && props.color)};
  border-radius: ${props => (props.borderRadiusor ? props.borderRadiusor : 0.3)}em;
  color: #fff;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;

  > img {
    width: 1em;
    margin-right: 0.2em;
  }

  &: hover {
    background-color: ${props => props.hoverBgColor && props.hoverBgColor};
  }
`;

export const ButtonDisable = styled(ButtonCore)`
  cursor: ${props => (props.disable ? 'not-allowed' : 'pointer')};
  width: ${props => (props.width ? props.width : '6.5em')};
  height: ${props => (props.height ? props.height : '1.7em')};
  background-color: ${props => (props.disable ? '#ccc' : props.color)};
  pointer-events: ${props => (props.disable ? 'none' : 'initial')};
`;

export const ButtonAdd = styled(ButtonCore)`
  background-position: center;
  background-image: url(${props => (props.bgrImage && props.bgrImage)});
  border-radius: ${props => (props.borderRadius ? props.borderRadius : '0.3em')};
  background-size: 50% 50%;
  background-repeat: no-repeat;
`;

export const ButtonIcon = styled(ButtonCore)`
  justify-content: space-evenly;
`;

export const ModalCustom = styled(Modal)`
  justify-content: center;
  font-size: ${props => props.fontSize}px;

  .modal-content {
    width: max-content;
    border-radius: 0.4rem;
  }
`;

export const ModalHeaderCustom = styled(ModalHeader)`
  background-color: #00647a;
  border-bottom: #00647a;
  color: #fff;
  height: 2.5em;
  padding: 0.5em;
  font-weight: 700;
  font-size: 1.5em;
`;

export const ModalBodyCustom = styled(ModalBody)`
  padding: 2em 3em;
  background-color: rgba(0, 0, 0, 0.85);
  color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const InputStyle = styled.input`
  height: 2.38em;
  border-radius: 0.278em;
  margin-top: 0.5em;
  margin-bottom: 0.5em;
  padding: 0.5em;
  border: 1px solid gray;
  width: 100%;
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin: 1em auto;
`;

export const Hr = styled.hr`
  margin-top: 1em;
  background-color: #f8f9fa87;
  height: 0.1em;
  width: 100%;
`;

export const BodyContentPopup = styled.div`
  margin: 0.5em;
  font-size: 1.5em;
`;

export const Message = styled.div`
  font-size: ${props => (props.fontSize ? props.fontSize : '0.5em')};
  font-weight: 900;
  color: red;
  position: absolute;
  word-break: break-all;
  line-height: 1.2em;
  margin-top: 0.3em;
`;

export const WrapperInput = styled.div`
  display: flex;
  height: 2em;
  align-items: center;
  width: ${props => props.width && props.width};
  line-height: 2em;
`;

export const Blank = styled.div`
  height: ${props => props.height}em;
  width: ${props => props.width}em;
`;

export const StyleInput = styled.input`
  height: ${props => props.height}em;
  padding: 0.5em;
  border-radius: 0.278em;
  border: 1px solid gray;
  width: ${props => props.width}em;
  margin: 0;
  font-size: ${props => props.fontSize}em;
`;

export const ErrorTextSelectTable = styled.p`
  white-space: pre;
`;
