
import styled from 'styled-components';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// (Form)
export const Wrapper = styled.div`
  width: 25em;
  border-radius: 0.3em;
  background-color: rgba(255, 255, 255, 0.6);
  padding: 0.75em;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: left;
  margin-bottom: 12vh;
`;

export const Block = styled(Form.Group)`
  margin-bottom: ${props => (props.bot || 1)}em;
`;

export const BlockRow = styled(Block)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

export const InputText = styled(Form.Control)`
  font-size: 1.3em;
  width: 100%;
  border-radius: 0.25em;
  height: calc(1.6em + 0.75em + 2px);
  padding: 0.375em 0.75em;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  box-sizing: border-box;
`;

export const ButtonLogin = styled(Button)`
  border-radius: 0.35em;
  font-size: 1.5em;
  font-weight: 500;
  width: 50%;
  background-color: rgb(23, 162, 183);
  border-color: rgb(204, 204, 204);
  white-space: nowrap;

  &: hover {
    background-color: rgb(55, 191, 206);
    border-color: rgb(204, 204, 204);
  }
`;

export const SpinnerStyle = {
  borderWidth: '0.1em',
  marginTop: '0.2em',
};

export const CenterStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export const DivCenter = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: unset;
  color: #495057;
  font-weight: bold;
  font-size: 1em;
`;

export const LogoImage = styled.img`
  width: 70%;
  margin-top: 2em;
  margin-bottom: 2em;
`;

export const CheckRemember = styled(Form.Check)`
  margin-left: 1em;
`;

export const ValidateAccountId = styled.div`
  color: red;
  padding-left: 0.375em;
`;
