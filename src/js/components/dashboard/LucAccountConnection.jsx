import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { validateRequired, validateEmail } from '../../helpers/validator';
import Alert from '../common/Alert/Alert';
import { TAB } from '../../constants/Constants';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import Spinner from '../common/Spinner';

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
`;

const Box = styled.div`
  width: 40%;
  height: 40%;
  min-height: 400px;
  min-width: 400px;
  background-color: #025587;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
`;

const TitleStyled = styled.p`
  color: white;
  font-size: 22px;
  font-weight: 600;
  margin-top: 20px;
`;

const FormStyled = styled.div`
  height: 45%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
`;

const WrapperInputStyled = styled.div`
  width: 100%;
`;

const InputStyled = styled.div`
  display: flex;
  width: 80%;
  margin-left: 10%;
  input {
    width: 100%;
    height: 40px;
    border: solid 1px grey;
    padding: 0 5px;
    border-left: none;
    outline: none;
  }
`;

const ButtonStyled = styled.div`
  width: 80%;
  text-align: center;
  color: white;
  background: #0E76A9;
  border-radius: 3px;
  border: none;
  margin-top: 10px;
  padding: 10px 0;
  cursor: pointer;

  &:hover {
    background: #347DEC;
  }
`;

const DescriptionStyled = styled.p`
  font-size: 16px;
  color: white;
  font-weight: 600;
`;

const ErrorMessageStyled = styled.div`
  padding-left: 10%;
  color: red;
  height: 24px;

  p {
    margin-bottom: 0 !important;
  }
`;

const EmptyMessage = styled.div`
  height: 24px;
`;

const renderErrorMessage = (message, isHide) => {
  if (isHide) {
    return <EmptyMessage />;
  }
  return (
    <ErrorMessageStyled>
      <p>{message}</p>
    </ErrorMessageStyled>
  );
};

class LucAccountConnection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      supportId: {
        isFocus: false,
        value: '',
        error: '',
      },
      email: {
        isFocus: false,
        value: '',
        error: '',
      },
      isLoading: false,
    };

    this.connectLucAccount = this.connectLucAccount.bind(this);
    this.fetchUser = this.fetchUser.bind(this);

    this.onSuccessLoginLucAcc = this.onSuccessLoginLucAcc.bind(this);
    this.onErrorLoginLucAcc = this.onErrorLoginLucAcc.bind(this);
  }

  componentDidMount() {
    this.fetchUser();
  }

  onSuccessLoginLucAcc(data) {
    this.setState({ isLoading: false });
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      Alert.instance.showAlert(
        'Success',
        'You had connected to an Luc888 account',
        'OK',
        () => {
          Alert.instance.hideAlert();
          this.props.handleChangeTab(TAB.DASHBOARD);
        },
        Alert.instance.hideAlert(),
      );
    }, () => { });
  }

  onErrorLoginLucAcc(error) {
    try {
      ApiErrorUtils.handleHttpError(error, Alert.instance);
    } catch (err) {
      // do something
    } finally {
      this.setState({ isLoading: false });
    }
  }

  getErrorInput() {
    const { email, supportId } = this.state;
    const emailError = validateRequired(email.value);
    const supportIdError = validateRequired(supportId.value);
    return {
      emailError,
      supportIdError,
    };
  }

  setErrorInput() {
    const { emailError, supportIdError } = this.getErrorInput();
    const currentState = { ...this.state };
    currentState.email.error = emailError;
    currentState.supportId.error = supportIdError;
    this.setState(currentState);
  }

  handleFocusInput(fieldName) {
    const currentState = { ...this.state };
    currentState[fieldName].isFocus = true;
    this.setState(currentState);
  }

  handleChangeInput(fieldName, value) {
    const currentState = { ...this.state };
    currentState[fieldName].value = value;
    this.setState(currentState);
  }

  handleBlurInput(fieldName) {
    const currentState = { ...this.state };
    currentState[fieldName].isFocus = false;
    currentState[fieldName].error = validateRequired(currentState[fieldName].value);
    if (fieldName === 'email') {
      currentState[fieldName].error = validateEmail(currentState[fieldName].value);
    }
    this.setState(currentState);
  }

  fetchUser() {
    this.props.fetchUser(() => { }, () => { });
  }

  connectLucAccount() {
    if (this.isFormValidate()) {
      this.setState({ isLoading: true });
      const { email, supportId } = this.state;
      this.props.connectLucAccount(supportId.value, email.value,
        this.onSuccessLoginLucAcc, this.onErrorLoginLucAcc);
    } else {
      this.setErrorInput();
    }
  }

  isFormValidate() {
    const { emailError, supportIdError } = this.getErrorInput();
    return emailError === '' && supportIdError === '';
  }

  renderInput(placeHolder, fieldName) {
    const currentState = { ...this.state };
    const item = currentState[`${fieldName}`];

    return (
      <WrapperInputStyled>
        <InputStyled>
          <input
            onFocus={() => this.handleFocusInput(fieldName)}
            onChange={e => this.handleChangeInput(fieldName, e.target.value)}
            onBlur={() => this.handleBlurInput(fieldName)}
            placeholder={placeHolder}
            value={item.value}
          />
        </InputStyled>
        {renderErrorMessage(item.error, item.isFocus)}
      </WrapperInputStyled>
    );
  }

  renderButton() {
    return (
      <ButtonStyled
        onClick={this.connectLucAccount}
      >
        Connect
      </ButtonStyled>
    );
  }

  render() {
    const { user } = this.props;
    if (user.detail.luc_user_id === undefined) {
      return (
        <Spinner
          isLoading={!user.detail.luc_user_id}
        />
      );
    }

    if (user.detail && user.detail.luc_user_id) {
      this.props.handleChangeTab(TAB.DASHBOARD);
      return <div />;
    }

    return (
      <Container>
        <Spinner isLoading={this.state.isLoading} />
        <Box>
          <TitleStyled>Link to account Luc888</TitleStyled>
          <FormStyled>
            {this.renderInput('Support Id', 'supportId')}
            {this.renderInput('Email', 'email')}
          </FormStyled>
          {this.renderButton()}
          <DescriptionStyled>
            * Please connect with account Normal Luc888
          </DescriptionStyled>
        </Box>
      </Container>
    );
  }
}

LucAccountConnection.propTypes = {
  fetchUser: PropTypes.func.isRequired,
  connectLucAccount: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  handleChangeTab: PropTypes.func.isRequired,
};

export default LucAccountConnection;
