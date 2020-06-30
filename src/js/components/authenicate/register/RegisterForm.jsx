import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Form from '../../common/Form';
import {
  checkEmail,
  checkPassword,
  checkConfirmPassword,
} from '../../../helpers/validator';
import i18n from '../../../i18n/i18n';
import ApiErrorUtils from '../../../helpers/ApiErrorUtils';
import Utils from '../../../helpers/utils';
import Checkbox from '../../common/Checkbox';
import { images } from '../../../theme';

const FormWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const FormTitle = styled.div`
  text-transform: uppercase;
  font-size: ${props => props.fontSize || '38px'};
  text-align: center;
  font-weight: bold;
  color: #fff;
  margin-bottom: 10px;
`;

const RegisterButton = styled.button`
  margin: 0.556em 1em 0 0.5em;
  text-transform: uppercase;
  width: ${props => props.width};
  height: ${props => props.height};
  background: ${props => props.background};
  border: 0 solid ${props => props.background};
  border-radius: 5px;
  cursor: pointer;
  margin-top: ${props => props.marginTop};
  color: #fff;
  font-size: ${props => props.fontSize};
  font-weight: bold;

  &: hover {
    background-color: ${props => props.hoverBgColor};
  }
`;

const LargeImageBg = styled.div`
  display: flex;
  width: 24em;
  height: ${props => (props.height ? props.height : '23em')};
  background-image: url(${images.registerFormBg});
  background-repeat: no-repeat;
  background-size: 100% 100%;
  justify-content: center;
`;

export const LogoLuc = styled.div`
  width: 97%;
  height: 98%;
  overflow: hidden;
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

const Background2 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(${images.logoShadow}) no-repeat;
  background-position: right -3.389em bottom -3.5em;
  background-position: right -61px bottom -63px;
  padding: 30px 20px;
  padding: 0;
  overflow: hidden;
  background-size: 60%;
  box-sizing: border-box;
  width: 99%;
  height: 99%;
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

const FormRegister = styled.div`
  float: left;
  width: 18.611em;
`;

const Feedback = styled.div`
  margin-top: 0.278em;
  color: red;
  float: left;
  text-align: left;
`;

const LabelCheckbox = styled.div`
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

const DIV = styled.div`
  text-align: left;
`;

const FormMessage = styled.div`
  flex: 1;
  padding: 2.222em;
`;

const MessageNotify = styled.div`
  margin-top: 0.889em;
  color: white;
  font-size: 0.889em;
  text-align: center;
  white-space: pre-wrap;
  line-height: 1.556em;
  text-transform: uppercase;
`;

const renderLabelCheckbox = () => (
  <LabelCheckbox>
    <div>
      {i18n.t('agreeUseAgreement')}
      {' '}
    </div>
    <DIV
      className="hyper-link"
      onClick={() => window.open('/terms-of-user', '_blank')}
    >
      {i18n.t('termOfUser')}
    </DIV>
    <div>
      {' '}
      {i18n.t('and')}
      {' '}
    </div>
    <DIV className="hyper-link" onClick={() => window.open('/privacy-policy', '_blank')}>
      {i18n.t('policyPrivacy')}
    </DIV>
  </LabelCheckbox>
);

class RegisterForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sendSuccess: false,
      step: '',

      email: '',
      isValidEmail: true,
      invalidEmailText: '',

      password: '',
      isValidPassword: true,
      invalidPasswordText: '',

      confirmPassword: '',
      isValidConfirmPassword: true,
      invalidConfirmPasswordText: '',

      isShowAuthStep2: false,
      authSettingData: null,
      emailVerify: {},
      isAgreeUseAgreement: false,
      invalidCheckedAgreeText: '',
      token: '',
    };
    this.isRegisterBySocial = false;
    this.handleChange = this.handleChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.onVerifySuccess = this.onVerifySuccess.bind(this);
    this.goToVerifyEmail = this.goToVerifyEmail.bind(this);
    this.onChangeCheckboxAgreement = this.onChangeCheckboxAgreement.bind(this);
  }

  componentDidMount() {
  }

  onSuccess(data) {
    const {
      goToScreen, getAlertRef,
      handleChangeForm, titlePage,
    } = this.props;
    const alert = getAlertRef();

    ApiErrorUtils.handleServerError(data, alert, () => {
      if (this.isRegisterBySocial) {
        const authSetApp = data.auth_setting ? data.auth_setting.auth_set_app : null;
        const authSetEmail = data.auth_setting ? data.auth_setting.auth_set_email : null;
        const authSetPhone = data.auth_setting ? data.auth_setting.auth_set_text : null;
        const accessToken = data ? data.access_token : null;
        const isShowAuthStep2 = Utils.isShowAuthStep2(authSetApp, authSetEmail, authSetPhone);
        if (isShowAuthStep2) {
          this.setState({ isShowAuthStep2: true, authSettingData: data.auth_setting });
        } else if (accessToken) {
          goToScreen('/top');
        } else {
          this.goToVerifyEmail(data);
        }
      } else this.setState({ sendSuccess: true });
    }, () => handleChangeForm(titlePage.SIGN_IN));
  }

  onError(error) {
    const { getAlertRef } = this.props;
    const alert = getAlertRef();
    ApiErrorUtils.handleHttpError(error, alert);
  }

  onEnter(e) {
    const value = e.target.value ? e.target.value.trim() : '';
    this.setState({ [e.target.name]: value.trim() }, () => this.handleRegister());
  }

  onVerifySuccess() {
    this.setState({ sendSuccess: true, step: '' });
  }

  onChangeCheckboxAgreement() {
    const { isAgreeUseAgreement } = this.state;
    this.setState({ isAgreeUseAgreement: !isAgreeUseAgreement }, () => this.validate());
  }

  goToVerifyEmail(data) {
    const {
      email, email_verified: isVerify, user_id: userId, token,
    } = data;
    this.setState({
      emailVerify: {
        email, isVerify, userId, token,
      },
      step: 'verifyEmail',
    });
  }

  handleChange(e) {
    const value = e.target.value ? e.target.value.trim() : '';
    this.setState({ [e.target.name]: value }, () => { this.validate(); });
  }

  handleRegister() {
    this.isRegisterBySocial = false;
    if (this.validate()) {
      const {
        email,
        password,
        confirmPassword,
      } = this.state;
      const { onPressRegister } = this.props;
      onPressRegister(
        email,
        password,
        confirmPassword,
        this.onSuccess,
        this.onError,
      );
    }
  }

  validateEmail() {
    const { email } = this.state;
    return checkEmail(email);
  }

  validatePassword() {
    const { password } = this.state;
    return checkPassword(password);
  }

  validateConfirmPassword() {
    const { password, confirmPassword } = this.state;
    return checkConfirmPassword(password, confirmPassword);
  }

  validate() {
    const currentState = {
      ...this.state,
      isValidEmail: true,
      invalidEmailText: '',
      isValidPassword: true,
      invalidPasswordText: '',
      isValidConfirmPassword: true,
      invalidConfirmPasswordText: '',
      invalidCheckedAgreeText: '',
    };

    const validateEmail = this.validateEmail();
    const { isValidEmail, invalidEmailText } = validateEmail;
    if (!isValidEmail) {
      currentState.isValidEmail = false;
      currentState.invalidEmailText = invalidEmailText;
      this.setState(currentState);
      return false;
    }

    const validatePassword = this.validatePassword();
    const { isValidPassword, invalidPasswordText } = validatePassword;
    if (!isValidPassword) {
      currentState.isValidPassword = false;
      currentState.invalidPasswordText = invalidPasswordText;
      this.setState(currentState);
      return false;
    }

    const validateConfirmPassword = this.validateConfirmPassword();
    const { isValidConfirmPassword, invalidConfirmPasswordText } = validateConfirmPassword;
    if (!isValidConfirmPassword) {
      currentState.isValidConfirmPassword = false;
      currentState.invalidConfirmPasswordText = invalidConfirmPasswordText;
      this.setState(currentState);
      return false;
    }

    if (!currentState.isAgreeUseAgreement) {
      currentState.invalidCheckedAgreeText = i18n.t('invalidAgreeUseAgreement');
      this.setState(currentState);
      return false;
    }

    this.setState(currentState);
    return true;
  }

  renderContent() {
    const { handleChangeForm, titlePage } = this.props;
    const {
      isValidEmail, invalidEmailText, isValidPassword,
      invalidPasswordText, isValidConfirmPassword, invalidConfirmPasswordText,
      invalidCheckedAgreeText,
    } = this.state;
    return (
      <FormRegister>
        <Form
          label={i18n.t('emailAddress')}
          onChange={this.handleChange}
          isValid={isValidEmail}
          invalidText={invalidEmailText}
          onEnter={e => this.onEnter(e)}
          type="email"
          name="email"
          marginBottom={isValidEmail ? 0.5 : 0}
          labelPaddingBottom={4}
        />
        <Form
          label={i18n.t('newPassword')}
          onChange={this.handleChange}
          isValid={isValidPassword}
          invalidText={invalidPasswordText}
          onEnter={e => this.onEnter(e)}
          type="password"
          name="password"
          marginBottom={isValidPassword ? 0.5 : 0}
          labelPaddingBottom={4}
          maxLength={20}
        />
        <Form
          label={i18n.t('confirmPassword')}
          onChange={this.handleChange}
          isValid={isValidConfirmPassword}
          invalidText={invalidConfirmPasswordText}
          onEnter={e => this.onEnter(e)}
          type="password"
          name="confirmPassword"
          marginBottom={isValidConfirmPassword ? 0.5 : 0}
          labelPaddingBottom={4}
          maxLength={20}
        />
        <Checkbox
          marginTop="0.556em"
          width="1.5em"
          height="1.5em"
          fontSize="0.8em"
          label={renderLabelCheckbox()}
          onChange={this.onChangeCheckboxAgreement}
        />
        <Feedback>{invalidCheckedAgreeText}</Feedback>
        <RegisterButton
          width="16em"
          height="2.2em"
          fontSize="1.111em"
          background="#186f00"
          hoverBgColor="#4CAF50"
          onClick={this.handleRegister}
        >
          {i18n.t('createAnAccount')}
        </RegisterButton>
        <RegisterButton
          width="16em"
          height="2.2em"
          fontSize="1.111em"
          background="#706732"
          hoverBgColor="#4CAF50"
          onClick={() => handleChangeForm(titlePage.SIGN_IN)}
        >
          {i18n.t('login_by_luc888')}
        </RegisterButton>
      </FormRegister>
    );
  }

  renderMessageForm() {
    const { titlePage, handleChangeForm } = this.props;
    return (
      <BackgroundLogoResponsive>
        <FormMessage>
          <MessageText>
            {i18n.t('sendRegisterLinkSuccess')}
          </MessageText>
          <MessageNotify>
            {i18n.t('notifyCheckMailRegister')}
          </MessageNotify>
          <RegisterButton
            width="15em"
            height="2.2em"
            marginTop="0.556em"
            fontSize="1.111em"
            background="#186f00"
            hoverBgColor="#4CAF50"
            onClick={() => handleChangeForm(titlePage.SIGN_IN)}
          >
            {i18n.t('login_by_luc888')}
          </RegisterButton>
        </FormMessage>
      </BackgroundLogoResponsive>
    );
  }

  render() {
    const { sendSuccess } = this.state;
    return (
      <FormWrapper>
        <FormTitle fontSize="2.5em">
          {i18n.t('createAnAccount')}
        </FormTitle>
        <LargeImageBg height="28em">
          <Background2>
            {sendSuccess ? this.renderMessageForm() : this.renderContent()}
          </Background2>
        </LargeImageBg>
      </FormWrapper>
    );
  }
}

RegisterForm.propTypes = {
  onPressRegister: PropTypes.func.isRequired,
  goToScreen: PropTypes.func.isRequired,
  getAlertRef: PropTypes.func.isRequired,
  titlePage: PropTypes.oneOfType([PropTypes.object, PropTypes.number]).isRequired,
  handleChangeForm: PropTypes.func.isRequired,
};

export default RegisterForm;
