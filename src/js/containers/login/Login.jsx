import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as actions from '../../actions/login';
import * as registerAction from '../../actions/register';
import * as maintainActions from '../../actions/maintain';
import * as stepAuthActions from '../../actions/stepAuth';
import SuperLogin from './SuperLogin';

class Login extends SuperLogin {
}

Login.propTypes = {
  login: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  fetchMaintainInfo: PropTypes.func.isRequired,
  history: PropTypes.oneOfType([PropTypes.object, PropTypes.number]).isRequired,
  onChangePageType: PropTypes.func.isRequired,
  submitCode: PropTypes.func.isRequired,
  sendCode: PropTypes.func.isRequired,
};

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(actions.login, dispatch),
  fetchMaintainInfo: bindActionCreators(maintainActions.fetchMaintainInfo, dispatch),
  register: bindActionCreators(registerAction.register, dispatch),
  submitCode: bindActionCreators(stepAuthActions.submitCode, dispatch),
  sendCode: bindActionCreators(stepAuthActions.sendCode, dispatch),
});

export default connect(null, mapDispatchToProps)(Login);
