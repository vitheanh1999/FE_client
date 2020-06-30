import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from '../../i18n/i18n';
import {
  FormWrapper,
  FormTitle,
  LargeImageBg,
  Background2,
  FormInput,
  AuthButton,
  Label,
} from '../authenicate/authStyle';
import {
  BUTTON_LOGIN,
  BUTTON_LOGIN_HOVER,
  BUTTON_REGISTER,
  BUTTON_REGISTER_HOVER,
} from '../../constants/styleDefaultAuth';

class Welcome extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { handleChangeForm, titlePage } = this.props;
    return (
      <FormWrapper>
        <FormTitle fontSize="1.5em">
          {i18n.t('welcome')}
        </FormTitle>
        <LargeImageBg>
          <Background2>
            <FormInput>
              <Label>{i18n.t('have_an_acc')}</Label>
              <AuthButton
                width="15em"
                height="2.2em"
                marginTop="0.556em"
                fontSize="1.111em"
                background={BUTTON_LOGIN}
                hoverBgColor={BUTTON_LOGIN_HOVER}
                onClick={() => handleChangeForm(titlePage.SIGN_IN)}
              >
                {i18n.t('login_by_luc888')}
              </AuthButton>
              <Label marginTop="4em">{i18n.t('not_register')}</Label>
              <AuthButton
                width="15em"
                height="2.2em"
                marginTop="0.556em"
                fontSize="1.111em"
                background={BUTTON_REGISTER}
                hoverBgColor={BUTTON_REGISTER_HOVER}
                onClick={() => handleChangeForm(titlePage.REGISTER)}
              >
                {i18n.t('register_now')}
              </AuthButton>
            </FormInput>
          </Background2>
        </LargeImageBg>
      </FormWrapper>
    );
  }
}

Welcome.propTypes = {
  titlePage: PropTypes.oneOfType([PropTypes.object, PropTypes.number]).isRequired,
  handleChangeForm: PropTypes.func.isRequired,
};

export default Welcome;
