import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from '../../components/common/Alert/Alert';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import StorageUtils, { STORAGE_KEYS } from '../../helpers/StorageUtils';
import { MAINTAIN_STATUS } from '../maintain/Maintain';
import ApiErrorCode from '../../constants/apiErrorCode';
import { MEMBER_ROLES } from '../../constants/auth';
import { socketConnectionDashboard } from '../../components/viewScreenGame/Utils';

export const cancelPusherMaintain = (socket) => {
  socket.unsubscribe('channel-system-maintain');
};

export const registerMaintainPush = (socket) => {
  const role = StorageUtils.getSectionStorageItem(STORAGE_KEYS.userRole);
  const nameChannelSystemStatus = 'channel-system-maintain';
  const startChannelSystemStatus = socket.subscribe(nameChannelSystemStatus);
  startChannelSystemStatus.bind('system-maintain', (event) => {
    if (
      event.status
      && parseInt(role, 10) !== MEMBER_ROLES.SUPER_USER.value
    ) {
      window.location.href = '/maintain';
    }
  });
};

const isOnIOS = navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i);
const eventName = isOnIOS ? 'pagehide' : 'beforeunload';

class BaseContainer extends Component {
  constructor(props) {
    super(props);
    this.saveCurrentState = this.saveCurrentState.bind(this);
    window.addEventListener(eventName, this.saveCurrentState);
    this.onCheckMaintainSuccess = this.onCheckMaintainSuccess.bind(this);
    this.onCheckMaintainError = this.onCheckMaintainError.bind(this);
    this.socket = socketConnectionDashboard;
  }

  componentDidMount() {
    registerMaintainPush(this.socket);
    this.registerShowNotificationMaintain(this.socket);
  }

  componentWillUnmount() {
    window.removeEventListener(eventName, this.saveCurrentState);
    cancelPusherMaintain(this.socket);
  }

  onCheckMaintainSuccess(data) {
    const role = StorageUtils.getSectionStorageItem(STORAGE_KEYS.userRole);
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      const { status } = data;
      if (
        status === MAINTAIN_STATUS.MaintainNow
        && parseInt(role, 10) !== MEMBER_ROLES.SUPER_USER.value
      ) {
        const { history } = this.props;
        history.replace('/maintain');
      }
    });
    this.setState({});
  }

  onCheckMaintainError(data) {
    const role = StorageUtils.getSectionStorageItem(STORAGE_KEYS.userRole);
    ApiErrorUtils.handleHttpError(data, Alert.instance, () => {
      if (!data.data) return;
      const { code } = data.data;
      if (
        code === ApiErrorCode.MAINTENANCE
        && parseInt(role, 10) !== MEMBER_ROLES.SUPER_USER.value
      ) {
        this.props.setMaintainInfo(data.data);
        const { history } = this.props;
        history.replace('/maintain');
      }
    });
  }

  checkMaintain() {
    // const { maintainInfo, fetchMaintainInfo } = this.props;
    // if (maintainInfo && !Object.keys(maintainInfo).length) {
    //   setTimeout(() => fetchMaintainInfo(this.onCheckMaintainSuccess,
    //     this.onCheckMaintainError), 100);
    // }
  }

  saveCurrentState() {
    StorageUtils.setSessionItemObject(STORAGE_KEYS.dashboardState, this.state);
  }

  restoreState() {
    const state = StorageUtils.getSessionItemObject(STORAGE_KEYS.dashboardState, null);
    StorageUtils.removeSectionStorageItem(STORAGE_KEYS.dashboardState);
    return state;
  }

  registerShowNotificationMaintain(socket) {
    const nameChannel = 'channel-maintenance-dashboard';
    const startChannel = socket.subscribe(nameChannel);
    startChannel.bind('maintenance-dashboard', (event) => {
      const { fetchMaintainInfo } = this.props;
      fetchMaintainInfo(this.onCheckMaintainSuccess, this.onCheckMaintainError);
    });
    this.setState({});
  }

  render() {
    return (
      <div />
    );
  }
}

BaseContainer.propTypes = {
  fetchMaintainInfo: PropTypes.func.isRequired,
  setMaintainInfo: PropTypes.func.isRequired,
  maintainInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  history: PropTypes.oneOfType([PropTypes.object, PropTypes.number]).isRequired,
};

export default BaseContainer;
