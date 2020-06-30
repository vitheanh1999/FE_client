import styled from 'styled-components';
import images from '../../theme/images';

export const SignInBLock = styled.div`
  height: 30em;
  width: 26em;
  background-image: url(${images.Login.loginBlock});
  color: #fff;
  border-radius: 0.575em;
  background-size: 100% 102%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  font-size: 16px;
`;

export const CommonButton = styled.div`
  width: ${props => (props.width ? props.width : '10em')};
  height: ${props => (props.height ? props.height : '3em')};
  text-transform: uppercase;
  font-weight: 600;
  background-color: ${props => (props.backgroundColor ? props.backgroundColor : '#186F00')};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.25em;
  font-size: ${props => (props.fontSize ? props.fontSize : '1.25em')};
  margin: 1.25em 0;
`;

export const ResetPassword = styled.div`
  text-decoration: underline;
  justify-content: flex-end;
  display: flex;
  font-size: 0.7em;

  a {
    cursor: pointer;
    color: #f8f9fa;
  }
`;

export const FormWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 120%;
  width: 24em;
  // min-width: 20em;
`;

export const FormTitle = styled.div`
  text-transform: uppercase;
  font-size: ${props => props.fontSize || '30px'};
  text-align: center;
  font-weight: bold;
  color: #fff;
  height: 1.5em;
  margin-bottom: 1em;
`;

export const AuthButton = styled.button`
  margin: ${props => (props.margin ? props.margin : ' 0 1em 0 1em')};
  text-transform: uppercase;
  width: ${props => props.width};
  height: ${props => props.height};
  background: ${props => props.background};
  border: 0 solid ${props => props.background};
  border-radius: ${props => (props.borderRadius ? props.borderRadius : '5px')};
  cursor: pointer;
  margin-top: ${props => props.marginTop};
  color: #fff;
  font-size: ${props => props.fontSize};
  font-weight: bold;
  white-space: nowrap;

  &: hover {
    background-color: ${props => props.hoverBgColor};
  }
`;

export const Button = styled.div`
  width: ${props => (props.width ? 'props.width' : '70%')};
  border: 2px solid #2d889c;
  border-radius: 0.55em;
  background-color: #00647a;
  height: 2.5em;
  white-space: nowrap;
  color: #fff;
  min-width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0.75em;
  text-transform: uppercase;
  font-size: 85%;
  margin: 0 0.5em 1em 0;

  &: hover {
    background-color: #2d889c;
  }
  font-weight: 550;
  align-self: ${props => props.alignSelf};
`;

export const DivSpaceBetween = styled.div`
  display: flex;
  flex-direction: ${props => (props.flexDirection ? props.flexDirection : 'row')};
  align-items: baseline;
  justify-content: space-between;
  width: 100%;
`;

export const DivLink = styled.div`
  text-decoration: underline;
  font-size: 85%;
  color: #fff;
  font-weight: 550;
  cursor: pointer;
  margin-bottom: 1em;
`;

export const CheckBox = styled.input`
  margin-left: 0.25em;
  margin-right: 0.25em;
`;

export const WrapperCheckBox = styled.div`
  color: #fff;
  font-size: 85%;
  white-space: nowrap;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: center;
`;

export const Logo = styled.img`
  width: 12.5em;
  margin-left: auto;
  margin-right: auto;
  padding: 0.5em 0;
`;

export const WrapperButton = styled.div`
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1em;
`;

export const LargeImageBg = styled.div`
  display: flex;
  width: 100%;
  min-width: fit-content;
  padding: 0 1.5em 1em 1.5em;
  background-color: rgba(37, 37, 37, 1);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  justify-content: center;
  border-radius: 0.5em;
  border-radius: 0.5em;
  border-width: 0.07em;
  border-style: solid;
  border-color: #ffffff4d;
`;

export const LogoLuc = styled.div`
  width: 97%;
  height: 98%;
  overflow: hidden;
  background: url(${images.footerBackground}) no-repeat;
  background-size: 60%;
  background-position: right -61px bottom -63px;
  padding: 30px 20px;
  box-sizing: border-box;
`;

export const BackgroundLogoResponsive = styled(LogoLuc)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-position: right -3.389em bottom -3.5em;
  padding: 0;
`;

export const Background2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-position: right -3.389em bottom -3.5em;
  background-position: right -61px bottom -63px;
  padding: 30px 20px;
  padding: 0;
  overflow: hidden;
  background-size: 60%;
  box-sizing: border-box;
  width: 99%;
  height: 99%;
  min-width: fit-content;
`;

export const MessageText = styled.div`
  color: white;
  font-size: 1.33em;
  text-align: center;
  white-space: pre-wrap;
  line-height: 2.222em;
  font-weight: bold;
  text-transform: uppercase;
`;

export const FormInput = styled.div`
  text-align: center;
  width: 100%;
`;

export const Feedback = styled.div`
  margin-top: 0.278em;
  color: red;
  float: left;
  text-align: left;
`;

export const LabelCheckbox = styled.div`
  text-align: left;

  div {
    display: inline;
  }

  .hyper-link {
    color: #3484e3;
    text-decoration: underline;
    cursor: pointer;
  }
`;

export const DIV = styled.div`
  text-align: left;
`;

export const Label = styled.div`
  color: #fff;
  text-align: center;
  margin-top: ${props => props.marginTop && props.marginTop};
`;
