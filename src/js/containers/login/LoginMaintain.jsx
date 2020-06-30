import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as actions from '../../actions/login';
import SuperLogin from './SuperLogin';

class LoginMaintain extends SuperLogin {
  componentDidMount() {
  }
}

LoginMaintain.propTypes = {
  login: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.oneOfType([PropTypes.object, PropTypes.number]).isRequired,
  match: PropTypes.objectOf(PropTypes.any).isRequired,
};

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(actions, dispatch),
});

export default connect(null, mapDispatchToProps)(LoginMaintain);
