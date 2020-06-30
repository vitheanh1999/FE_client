import React, { Component } from 'react';
import PropsType from 'prop-types';
import {
  ModalBodyCustom,
  WrapperTabMenu,
} from './ChargeStyle';
import i18n from '../../i18n/i18n';
import TabMenu from '../common/TabMenu';
import HistoryCharge from './HistoryCharge';
import HistoryPayout from './HistoryPayout';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import Alert from '../common/Alert/Alert';
import Spinner from '../common/Spinner';

export const TABS = {
  CHARGE: { id: 2, tabName: 'GcCharge' },
  PAYOUT: { id: 1, tabName: 'payoutHistory' },
};

class ChargeHistoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: TABS.PAYOUT,
      historyPayout: {},
      historyCharge: {},
      isLoading: false,
    };

    this.changeTab = this.changeTab.bind(this);
    this.fetchHistoryCharge = this.fetchHistoryCharge.bind(this);
    this.fetchHistoryPayout = this.fetchHistoryPayout.bind(this);
    this.onSuccessFetchHistoryPayout = this.onSuccessFetchHistoryPayout.bind(this);
    this.onSuccessFetchHistoryCharge = this.onSuccessFetchHistoryCharge.bind(this);
    this.onError = this.onError.bind(this);
  }

  onSuccessFetchHistoryPayout(data) {
    this.setState({ isLoading: false });
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => {
        this.setState({
          historyPayout: data,
        });
      },
    );
  }

  onSuccessFetchHistoryCharge(data) {
    this.setState({ isLoading: false });
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => {
        this.setState({
          historyCharge: data,
        });
      },
    );
  }

  onError(error) {
    ApiErrorUtils.handleHttpError(error, Alert.instance);
    this.setState({ isLoading: false });
  }


  fetchHistoryCharge(perPage, currentPage) {
    this.setState({ isLoading: true });
    this.props.getGiftHistory(
      perPage, currentPage, this.onSuccessFetchHistoryCharge, this.onError,
    );
  }

  fetchHistoryPayout(perPage, currentPage) {
    this.setState({ isLoading: true });
    const params = {
      per_page: perPage,
      current_page: currentPage,
    };
    this.props.fetchPayoutHistory(params, this.onSuccessFetchHistoryPayout, this.onError);
  }

  changeTab() {
    let { currentTab } = this.state;
    currentTab = currentTab === TABS.PAYOUT ? TABS.CHARGE : TABS.PAYOUT;
    this.setState({
      currentTab,
    });
  }

  render() {
    const {
      isLoading, currentTab,
      historyPayout, historyCharge,
    } = this.state;
    return (
      <ModalBodyCustom>
        <WrapperTabMenu>
          <TabMenu
            textLeft={i18n.t(TABS.PAYOUT.tabName)}
            textRight={i18n.t(TABS.CHARGE.tabName)}
            isSelectLeft={currentTab === TABS.PAYOUT}
            onChange={() => this.changeTab()}
            notificationNumber={0}
          />
        </WrapperTabMenu>
        {
          currentTab === TABS.PAYOUT
            ? (
              <HistoryPayout
                historyPayout={historyPayout}
                fetchHistoryPayout={this.fetchHistoryPayout}
              />
            )
            : (
              <HistoryCharge
                historyCharge={historyCharge}
                fetchHistoryCharge={this.fetchHistoryCharge}
              />
            )
        }
        <Spinner isLoading={isLoading} />
      </ModalBodyCustom>
    );
  }
}

ChargeHistoryModal.defaultProps = {
};

ChargeHistoryModal.propTypes = {
  fetchPayoutHistory: PropsType.func.isRequired,
  getGiftHistory: PropsType.func.isRequired,
};

export default ChargeHistoryModal;
