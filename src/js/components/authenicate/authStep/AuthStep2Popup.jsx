import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import AuthItem from './AuthItem';
import FormCustom from '../../common/FormCustom';
import Checkbox from '../../common/Checkbox';
import i18n from '../../../i18n/i18n';
import ApiErrorUtils from '../../../helpers/ApiErrorUtils';
import StorageUtils, { AUTH_SECURITY_REMEMBER_KEY, USER_ID_KEY, STORAGE_KEYS } from '../../../helpers/StorageUtils';
import securityActions from '../../../constants/securityActions';
import ApiErrorCode from '../../../constants/apiErrorCode';
import { getCurrentBaseUrl } from '../../../helpers/utils';
import { Button, WrapperButton } from '../authStyle';

const SECURITY_TYPE = {
  EMAIL: 0,
  PHONE: 1,
  APP: 2,
};

const setInitAuthStep2Type = (data, type) => {
  if (!data) return false;

  if (type === SECURITY_TYPE.EMAIL) {
    return (data.auth_set_email === 1);
  }

  if (type === SECURITY_TYPE.PHONE) {
    return (data.auth_set_email !== 1 && data.auth_set_text === 1);
  }

  if (
    data.auth_set_email !== 1
    && data.auth_set_text !== 1
    && data.auth_set_app === 1
  ) {
    return true;
  }

  return false;
};

const redirectFunction = () => {
  const baseUrl = getCurrentBaseUrl();
  window.location.replace(baseUrl);
};

const handleServerError = (data, alertPopup, onSuccess) => {
  const { code, message } = data;
  let result = false;
  if (!alertPopup) return false;
  if (code >= 200 && code < 300) {
    if (onSuccess) onSuccess();
    else alertPopup.showAlert(i18n.t('success'), message);
    result = true;
  } else if (code === ApiErrorCode.UNAUTHORIZED) {
    const okTitle = window.location.pathname === '/' ? i18n.t('ok') : i18n.t('login');
    StorageUtils.clearInfoLogout();
    alertPopup.showAlert(i18n.t('error'), message, () => redirectFunction(), null, null, null, () => redirectFunction(), okTitle);
  } else {
    alertPopup.showAlert(i18n.t('error'), message);
  }
  return result;
};

class AuthStep2Popup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isRemember: false,
      code: '',
      inValidCodeText: '',
      isShowEmailBlock: setInitAuthStep2Type(props.data, SECURITY_TYPE.EMAIL),
      isShowSNSBlock: setInitAuthStep2Type(props.data, SECURITY_TYPE.PHONE),
      isShowAuthAppBlock: setInitAuthStep2Type(props.data, SECURITY_TYPE.APP),
    };

    this.handleShowEmailBlock = this.handleShowEmailBlock.bind(this);
    this.handleShowSNSBlock = this.handleShowSNSBlock.bind(this);
    this.handleShowAuthAppBlock = this.handleShowAuthAppBlock.bind(this);
    this.onConfirmCodeBlur = this.onConfirmCodeBlur.bind(this);
    this.onConfirmCodeChange = this.onConfirmCodeChange.bind(this);
    this.handleSubmitCode = this.handleSubmitCode.bind(this);
    this.onRememberCheckboxChange = this.onRememberCheckboxChange.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
  }

  onSuccess(data) {
    const { getAlertRef, handleChangeLoading } = this.props;
    handleChangeLoading(false);
    ApiErrorUtils.handleServerError(data, getAlertRef(), null, null, null, true);
  }

  onError(error) {
    const { getAlertRef, handleChangeLoading } = this.props;
    ApiErrorUtils.handleHttpError(error, getAlertRef());
    handleChangeLoading(false);
  }

  onConfirmCodeBlur() {
    this.validateCode();
  }

  onConfirmCodeChange(e) {
    const code = e.target.value ? e.target.value.trim() : '';
    this.setState({ code });
  }

  onRememberCheckboxChange() {
    const { isRemember } = this.state;
    this.setState({ isRemember: !isRemember });
  }

  onClose() {
    const { data, onClose } = this.props;
    this.setState({
      isRemember: false,
      code: '',
      inValidCodeText: '',
      isShowEmailBlock: setInitAuthStep2Type(data, SECURITY_TYPE.EMAIL),
      isShowSNSBlock: setInitAuthStep2Type(data, SECURITY_TYPE.PHONE),
      isShowAuthAppBlock: setInitAuthStep2Type(data, SECURITY_TYPE.APP),
    }, onClose());
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { data } = this.props;
    if (newProps.data && newProps.data !== data) {
      this.setState({
        isShowEmailBlock: setInitAuthStep2Type(newProps.data, SECURITY_TYPE.EMAIL),
        isShowSNSBlock: setInitAuthStep2Type(newProps.data, SECURITY_TYPE.PHONE),
        isShowAuthAppBlock: setInitAuthStep2Type(newProps.data, SECURITY_TYPE.APP),
      });
    }
  }

  validateCode() {
    let isValid = true;
    let inValidCodeText = '';

    const { code } = this.state;

    if (code === '') {
      isValid = false;
      inValidCodeText = i18n.t('invalidCode');
    }

    this.setState({
      inValidCodeText,
    });

    return isValid;
  }

  handleShowEmailBlock() {
    this.setState({
      isShowEmailBlock: true,
      isShowSNSBlock: false,
      isShowAuthAppBlock: false,
    });
  }

  handleShowSNSBlock() {
    this.setState({
      isShowEmailBlock: false,
      isShowSNSBlock: true,
      isShowAuthAppBlock: false,
    });
  }

  handleShowAuthAppBlock() {
    this.setState({
      isShowEmailBlock: false,
      isShowSNSBlock: false,
      isShowAuthAppBlock: true,
    });
  }

  handleSendCode(method) {
    const {
      sendCode, data,
      actionCode, handleChangeLoading,
    } = this.props;
    const email = data && data.auth_email ? data.auth_email : null;
    const phone = data && data.auth_phone ? data.auth_phone : null;
    handleChangeLoading(true);
    sendCode(actionCode, method, email, phone, this.onSuccess, this.onError);
  }

  updateUserInfo() {
    const { setUserInfoData, data, actionCode } = this.props;
    switch (actionCode) {
      case securityActions.disableSettingEmail.actionCode:
        data.auth_set_email = 0;
        break;
      case securityActions.disableSettingPhone.actionCode:
        data.auth_set_text = 0;
        break;
      case securityActions.disableSettingApp.actionCode:
        data.auth_set_app = 0;
        break;
      default:
        break;
    }
    setUserInfoData(data);
  }

  saveRememberMeData() {
    const { isRemember } = this.state;
    if (isRemember) {
      const date = new Date();
      const rememberMeData = {
        userId: parseInt(StorageUtils.getSectionStorageItem(USER_ID_KEY), 10),
        time: date.getTime(),
      };
      StorageUtils.setItem(AUTH_SECURITY_REMEMBER_KEY, JSON.stringify(rememberMeData));
    } else StorageUtils.setItem(AUTH_SECURITY_REMEMBER_KEY, '');
  }

  callbackSubmitCode(response) {
    const {
      getAlertRef, goToBack,
      actionCode, goToScreen,
      handleChangeLoading,
    } = this.props;
    const { message } = response;
    const alert = getAlertRef();
    handleChangeLoading(false);

    handleServerError(response, alert, () => {
      if (actionCode === securityActions.login.actionCode) {
        this.saveRememberMeData();
        StorageUtils.setItem(STORAGE_KEYS.waitSubmit2StepFa, 0);
        goToScreen('/');
      } else {
        if (goToBack) {
          goToBack();
        }
        alert.show(i18n.t('success'), message);
        this.updateUserInfo();
        this.onClose();
      }
    });
  }

  handleSubmitCode() {
    if (!this.validateCode()) return;

    const { code, isShowSNSBlock, isShowAuthAppBlock } = this.state;
    const {
      submitCode, actionCode,
      handleChangeLoading,
    } = this.props;

    let method = 1;
    if (isShowSNSBlock) method = 2;
    else if (isShowAuthAppBlock) method = 3;
    handleChangeLoading(true);

    submitCode(
      actionCode,
      method,
      code,
      (response) => {
        this.callbackSubmitCode(response);
      },
      this.onError,
    );
  }

  renderCheckbox() {
    const { actionCode } = this.props;
    if (actionCode === securityActions.login.actionCode) {
      return <Checkbox label={<p>{i18n.t('rememberMe')}</p>} onChange={this.onRememberCheckboxChange} />;
    }
    return '';
  }

  renderContent() {
    const { data, backToLogin } = this.props;
    const {
      isShowEmailBlock,
      isShowSNSBlock,
      isShowAuthAppBlock,
      code,
      isValid,
      inValidCodeText,
    } = this.state;
    const authSetEmail = !!(data && data.auth_set_email === 1);
    const authSetPhone = !!(data && data.auth_set_text === 1);
    const authSetApp = !!(data && data.auth_set_app === 1);

    return (
      <Fragment>
        {authSetEmail ? (
          <AuthItem
            title={i18n.t('email')}
            checked={isShowEmailBlock}
            onChange={this.handleShowEmailBlock}
            onSubmit={() => this.handleSendCode(1)}
          />
        ) : ''}
        {authSetPhone ? (
          <AuthItem
            title={i18n.t('textMessage')}
            checked={isShowSNSBlock}
            onChange={this.handleShowSNSBlock}
            onSubmit={() => this.handleSendCode(2)}
          />
        ) : ''}
        {authSetApp ? (
          <AuthItem
            title={i18n.t('authenticationApp')}
            checked={isShowAuthAppBlock}
            onChange={this.handleShowAuthAppBlock}
            showButton={false}
          />
        ) : ''}
        <FormCustom
          label={i18n.t('authenticationCode')}
          labelPaddingBottom={4}
          maxLength={20}
          marginBottom={0}
          value={code}
          isValid={isValid || false}
          invalidText={inValidCodeText}
          onBlur={this.onConfirmCodeBlur}
          onChange={this.onConfirmCodeChange}
          onEnter={this.handleSubmitCode}
        />
        {this.renderCheckbox()}
        <WrapperButton>
          <Button
            alignSelf="center"
            onClick={this.handleSubmitCode}
          >
            {i18n.t('submitCode')}
          </Button>
          <Button
            alignSelf="center"
            onClick={backToLogin}
          >
            {i18n.t('backToLogin')}
          </Button>
        </WrapperButton>
      </Fragment>
    );
  }

  render() {
    const { actionCode } = this.props;
    if (actionCode === securityActions.login.actionCode) {
      return <div>{this.renderContent()}</div>;
    }

    return (
      <div>
        {this.renderContent()}
      </div>
    );
  }
}

export default AuthStep2Popup;

AuthStep2Popup.defaultProps = {
  setUserInfoData: null,
  data: null,
  onClose: null,
  goToBack: () => { },
  backToLogin: () => { },
  handleChangeLoading: () => { },
};

AuthStep2Popup.propTypes = {
  onClose: PropTypes.func,
  data: PropTypes.oneOfType([PropTypes.object]),
  sendCode: PropTypes.func.isRequired,
  submitCode: PropTypes.func.isRequired,
  setUserInfoData: PropTypes.func,
  actionCode: PropTypes.string.isRequired,
  getAlertRef: PropTypes.func.isRequired,
  goToScreen: PropTypes.func.isRequired,
  goToBack: PropTypes.func,
  backToLogin: PropTypes.func,
  handleChangeLoading: PropTypes.func,
};
