
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import qs from 'qs';
import PropTypes from 'prop-types';
import * as authActions from '../../actions/auth';
import StorageUtils, { STORAGE_KEYS } from '../../helpers/StorageUtils';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import Alert from '../common/Alert/Alert';
import { getCompanyInfo } from '../login/SignIn';

class Authenticate extends React.Component {
  componentDidMount() {
    const { token } = qs.parse(this.props.location.search.replace('?', ''));
    if (token) {
      StorageUtils.setToken(token);
      this.props.fetchUser((data) => {
        ApiErrorUtils.handleServerError(data, Alert.instance, () => {
          StorageUtils.setSectionStorageItem(STORAGE_KEYS.userRole, data.data.role);
          StorageUtils.setCompanyInfo(getCompanyInfo(data.data.provider_code));
          this.props.history.push('/');
        });
      }, (error) => {
        ApiErrorUtils.handleHttpError(error, Alert.instance);
      });
    }
  }

  render() {
    return (
      <Alert />
    );
  }
}

Authenticate.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  fetchUser: PropTypes.func.isRequired,
};

Authenticate.defaultProps = {
};

const mapDispatchToProps = dispatch => ({
  fetchUser: bindActionCreators(authActions.fetchUser, dispatch),
});

export default connect(null, mapDispatchToProps)(Authenticate);
