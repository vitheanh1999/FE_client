import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import i18n from '../../i18n/i18n';
import FormCustom from '../common/FormCustom';
import { checkEmail, checkPassword } from '../../helpers/validator';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import { checkEnableSecuritySetting, checkShowAuthStep2 } from '../../helpers/utils';
import { API_LUC888 } from '../../config/localConfig';
import securityActions from '../../constants/securityActions';
import AuthStep2Popup from '../authenicate/authStep/AuthStep2Popup';
import Spinner from '../common/Spinner';
import images from '../../../assets/images';
import {
  FormWrapper, FormTitle, LargeImageBg, Background2, FormInput,
  WrapperButton, Button, DivLink, Logo, DivSpaceBetween,
  WrapperCheckBox, CheckBox,
} from '../authenicate/authStyle';
import StorageUtils, { STORAGE_KEYS } from '../../helpers/StorageUtils';

// import {
//   BUTTON_ACTION,
//   BUTTON_ACTION_HOVER,
//   BUTTON_REGISTER,
//   BUTTON_REGISTER_HOVER,
// } from '../../constants/styleDefaultAuth';

export const getCompanyInfo = () => {
};

export const lastUser = 'LAST USER';
class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lockLogin: false,
      isLoading: false,
      isRememberUser: false,

      sendSuccess: false,
      step: '',
      isShowAuthStep2: false,
      authSettingData: null,
      token: '',

      email: '',
      isValidEmail: true,
      invalidEmailText: '',

      password: '',
      isValidPassword: true,
      invalidPasswordText: '',

    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleChangeLoading = this.handleChangeLoading.bind(this);
    this.backToLogin = this.backToLogin.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.onChangeRemember = this.onChangeRemember.bind(this);
  }

  componentDidMount() {
    const userInfo = StorageUtils.getItemObject(lastUser, {}, true);
    if (Object.keys(userInfo).length > 0) {
      this.setState({
        email: userInfo.email,
        password: userInfo.password,
        isRememberUser: true,
      });
    }
  }

  onSuccess(data) {
    const {
      goToScreen, getAlertRef,
      submitCode,
    } = this.props;
    const { isRememberUser, email, password } = this.state;
    this.setState({ lockLogin: false, isLoading: false });
    const alert = getAlertRef();

    const authSetPhone = data.auth_setting ? data.auth_setting.auth_set_text : null;
    const authSetApp = data.auth_setting ? data.auth_setting.auth_set_app : null;
    const authSetEmail = data.auth_setting ? data.auth_setting.auth_set_email : null;

    const isEnableSecuritySetting = checkEnableSecuritySetting(authSetApp,
      authSetEmail, authSetPhone);
    const isShowAuthStep2 = checkShowAuthStep2(authSetApp, authSetEmail, authSetPhone);
    const isIn30Days = isEnableSecuritySetting && !isShowAuthStep2;
    const rememberUser = { email, password };
    if (isRememberUser) {
      StorageUtils.setItemObject(lastUser, rememberUser, true);
    } else {
      StorageUtils.setItemObject(lastUser, '', false);
    }

    if (isShowAuthStep2) {
      ApiErrorUtils.handleServerError(data, alert, () => {
        this.setState({ isShowAuthStep2: true, authSettingData: data.auth_setting });
      });
      return;
    }

    if (isIn30Days) {
      ApiErrorUtils.handleServerError(data, alert, () => {
        submitCode(securityActions.login.actionCode, null, null, (response) => {
          ApiErrorUtils.handleServerError(response, alert,
            () => goToScreen('/'));
        }, (error) => {
          ApiErrorUtils.handleHttpError(error, alert);
        });
      });
    } else {
      ApiErrorUtils.handleServerError(data, alert, () => goToScreen('/'));
    }
  }

  onError(error) {
    const { getAlertRef } = this.props;
    const alert = getAlertRef();
    this.setState({ lockLogin: false, isLoading: false });
    ApiErrorUtils.handleHttpError(error, alert);
  }

  onEnter(e) {
    const value = e.target.value ? e.target.value.trim() : '';
    this.setState({ [e.target.name]: value.trim() }, () => this.handleLogin());
  }

  onChangeRemember(event) {
    this.setState({
      isRememberUser: event.target.checked,
    });
  }

  handleChange(e) {
    const value = e.target.value ? e.target.value.trim() : '';
    this.setState({ [e.target.name]: value }, () => { this.validate(); });
  }

  handleLogin() {
    const { lockLogin, email, password } = this.state;
    if (this.validate() && !lockLogin) {
      const { onLogin } = this.props;
      this.setState({ lockLogin: true, isLoading: true });
      onLogin(
        email,
        password,
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

  validate() {
    const currentState = {
      ...this.state,
      isValidEmail: true,
      invalidEmailText: '',
      isValidPassword: true,
      invalidPasswordText: '',
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

    this.setState(currentState);
    return true;
  }

  backToLogin() {
    this.setState({ isShowAuthStep2: false, authSettingData: null });
  }

  handleChangeLoading(boolValue) {
    this.setState({ isLoading: boolValue });
  }

  renderFormInput() {
    const {
      isValidEmail, invalidEmailText, isValidPassword,
      invalidPasswordText, email, password,
    } = this.state;
    return (
      <Fragment>
        <FormCustom
          onChange={this.handleChange}
          isValid={isValidEmail}
          invalidText={invalidEmailText}
          onEnter={e => this.onEnter(e)}
          onBlur={this.handleChange}
          isAllowWhiteSpace={false}
          type="email"
          name="email"
          marginBottom={isValidEmail ? 1 : 0}
          labelPaddingBottom={4}
          autoFocus
          placeholder={i18n.t('emailAddress')}
          value={email}
        />
        <FormCustom
          onChange={this.handleChange}
          isValid={isValidPassword}
          invalidText={invalidPasswordText}
          onEnter={e => this.onEnter(e)}
          type="password"
          name="password"
          marginBottom={isValidPassword ? 0.5 : 0}
          labelPaddingBottom={4}
          maxLength={20}
          placeholder={i18n.t('password')}
          value={password}
        />
      </Fragment>
    );
  }

  renderButtonSignIn() {
    const affiliateCode = StorageUtils.getSectionStorageItem(STORAGE_KEYS.affiliateCode);
    const affiliateParam = affiliateCode ? '&ref='.concat(affiliateCode) : '';
    const registerLink = API_LUC888.concat('register?type=fe').concat(affiliateParam);
    const { isRememberUser } = this.state;
    return (
      <WrapperButton>
        <DivSpaceBetween>
          <Button onClick={this.handleLogin}>
            {i18n.t('login_by_luc888')}
          </Button>
          <WrapperCheckBox>
            <CheckBox type="checkbox" checked={isRememberUser} onChange={event => this.onChangeRemember(event)} /> {i18n.t('rememberUser')}
          </WrapperCheckBox>
        </DivSpaceBetween>
        <DivLink onClick={() => window.open(registerLink)}>
          {i18n.t('registerLUC88Account')}
        </DivLink>
      </WrapperButton>
    );
  }

  renderStepAuth() {
    const {
      goToScreen, sendCode, submitCode,
      getAlertRef, actionCode,
    } = this.props;
    const { authSettingData } = this.state;
    return (
      <AuthStep2Popup
        data={authSettingData}
        goToScreen={goToScreen}
        sendCode={sendCode}
        submitCode={submitCode}
        getAlertRef={getAlertRef}
        actionCode={actionCode}
        backToLogin={this.backToLogin}
        handleChangeLoading={this.handleChangeLoading}
      />
    );
  }

  renderAuthForm() {
    const { isShowAuthStep2 } = this.state;
    if (isShowAuthStep2) {
      return this.renderStepAuth();
    }

    return (
      <Fragment>
        {this.renderFormInput()}
        {this.renderButtonSignIn()}
      </Fragment>
    );
  }

  render() {
    const { isShowAuthStep2, isLoading } = this.state;
    return (
      <FormWrapper>
        <FormTitle fontSize="1.2em">
          {!isShowAuthStep2 ? i18n.t('login_by_luc888') : i18n.t('twoStepAuthentication')}
        </FormTitle>
        <LargeImageBg>
          <Background2>
            <FormInput>
              <Logo src={images.logoFE} />
              {this.renderAuthForm()}
            </FormInput>
          </Background2>
        </LargeImageBg>
        <Spinner isLoading={isLoading} />
      </FormWrapper>
    );
  }
}

SignIn.propTypes = {
  onLogin: PropTypes.func.isRequired,
  getAlertRef: PropTypes.func.isRequired,
  goToScreen: PropTypes.func.isRequired,
  submitCode: PropTypes.func.isRequired,
  sendCode: PropTypes.func.isRequired,
  actionCode: PropTypes.string.isRequired,
};

export default SignIn;
