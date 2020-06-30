import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import HeaderAuth from '../../components/common/Header/HeaderAuth';
import FooterAuth from '../../components/common/FooterAuth';
import RegisterForm from '../../components/authenicate/register/RegisterForm';
import * as registerAction from '../../actions/register';
import Alert from '../../components/common/Alert/Alert';
import StorageUtils from '../../helpers/StorageUtils';
import { calculatorFontSize } from '../mainScreen/MainScreen';
import { Wrapper, Body } from './authStyle';

class Register extends Component {
  constructor(props) {
    super(props);
    this.refAlert = null;
    this.goToScreen = this.goToScreen.bind(this);
    this.getAlertRef = this.getAlertRef.bind(this);
    this.onResize = this.onResize.bind(this);
    StorageUtils.clearInfoLogout();
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.setState({});
  }

  getAlertRef() {
    return this.refAlert;
  }

  goToScreen(route) {
    const { history } = this.props;
    history.push(route);
  }

  render() {
    const { history, register } = this.props;
    const fontSize = calculatorFontSize();
    return (
      <div>
        <Wrapper id="root-content" fontSize={fontSize}>
          <HeaderAuth />
          <Body>
            <RegisterForm
              onPressRegister={register}
              goToScreen={this.goToScreen}
              getAlertRef={this.getAlertRef}
            />
          </Body>
        </Wrapper>
        <Alert ref={(ref) => { this.refAlert = ref; }} />
        <FooterAuth isLoggedIn={false} history={history} />
      </div>
    );
  }
}

Register.propTypes = {
  register: PropTypes.func.isRequired,
  history: PropTypes.oneOfType([PropTypes.object, PropTypes.number]).isRequired,
};

const mapDispatchToProps = dispatch => ({
  register: bindActionCreators(registerAction.register, dispatch),
});

export default connect(null, mapDispatchToProps)(Register);
