import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Alert from '../../components/common/Alert/Alert';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import * as botActions from '../../actions/ListBots';
import * as campaignActions from '../../actions/campaign';
import ListCampaign from '../../components/campaign/ListCampaign';
import CampaignDetail from '../../components/campaign/CampaignDetail';
import { OPTIONS_MODE } from '../../components/campaign/detail/TabAdvanceSetting';
import { ModalWrapper, ModalHeaderCustom } from '../../components/common/CommonStyle';
import i18n from '../../i18n/i18n';

const Content = styled.div`
  width: 100%;
  height: 100%;
`;

const onSuccess = (data) => {
  ApiErrorUtils.handleServerError(data, Alert.instance, () => { });
};

const onError = (error) => {
  try {
    ApiErrorUtils.handleHttpError(error, Alert.instance, () => { });
  } catch (err) {
    // do something
  }
};

const getLogicDefault = (listLogicPatterns) => {
  for (let i = 0; i < listLogicPatterns.length; i += 1) {
    const logicPattern = listLogicPatterns[i];
    if (logicPattern.status_fe) return logicPattern;
  }
  return {};
};

const getBetPatternDefault = listBetPatterns => getLogicDefault(listBetPatterns);

class Campaign extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowDetail: false,
      campaign: null,
      maxCampaign: 100,
    };

    this.showCampaignDetail = this.showCampaignDetail.bind(this);
    this.closeCampaignDetail = this.closeCampaignDetail.bind(this);
    this.fetchListPattern = this.fetchListPattern.bind(this);
    this.fetchSettingAdmin = this.fetchSettingAdmin.bind(this);
    this.onSuccessSettingAdmin = this.onSuccessSettingAdmin.bind(this);
    this.addCampaign = this.addCampaign.bind(this);
  }

  componentDidMount() {
    this.fetchSettingAdmin();
  }

  onSuccessSettingAdmin(data) {
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      if (data.data.max_campaign) {
        this.setState({
          maxCampaign: data.data.max_campaign,
        });
      }
    });
  }

  showCampaignDetail(campaign) {
    this.setState({ isShowDetail: true, campaign });
  }

  closeCampaignDetail() {
    this.setState({ isShowDetail: false, campaign: null });
  }

  addCampaign() {
    const { data } = this.props;
    const logicPattern = getLogicDefault(data.listLogicPatterns);
    const betPattern = getBetPatternDefault(data.listBetPatterns);
    const userId = data.userInfo.detail.user_id;
    const defaultCampaignInfo = {
      name: '',
      user_id: userId,
      profit_data: {
        max_profit: 0,
        min_profit: 0,
      },
      data: {
        win_rate_value: '',
        nearest_turns: '',
        zero_bet_mode: OPTIONS_MODE[0].id,
        point_rate: 1,
        components: [
          {
            logic_pattern_id: logicPattern.id,
            logic_pattern_name: logicPattern.logic_pattern_name,
            logic_pattern_description: logicPattern.description,
            bet_pattern_id: betPattern.id,
            bet_pattern_name: betPattern.bet_pattern_name,
            bet_pattern_description: betPattern.description,
            look_rate_value: 0,
          },
        ],
      },
    };
    this.setState({ isShowDetail: true, campaign: defaultCampaignInfo });
  }

  fetchListPattern() {
    const { actions } = this.props;
    const { campaign } = this.state;
    actions.listCampaigns.fetchListLogicPattern(campaign && campaign._id, onSuccess, onError);
    actions.listCampaigns.fetchListBetPattern(campaign && campaign._id, onSuccess, onError);
  }

  fetchSettingAdmin() {
    const { actions } = this.props;
    actions.fetchSettingAdmin(this.onSuccessSettingAdmin, onError);
  }

  renderDetailModal() {
    const { isShowDetail, campaign } = this.state;
    const {
      actions, data,
      fontSize, isMobile,
    } = this.props;
    return (
      <ModalWrapper
        id="DetailModal"
        isOpen={isShowDetail}
        centered
        isMobile={isMobile}
      >
        <ModalHeaderCustom toggle={this.closeCampaignDetail}>
          {(campaign && campaign._id) ? i18n.t('campaignDetail') : i18n.t('addCampaign')}
        </ModalHeaderCustom>
        <CampaignDetail
          fetchListCampaigns={actions.listCampaigns.fetchListCampaigns}
          campaignInfo={campaign}
          onClose={() => this.setState({ isShowDetail: false })}
          createCampaign={actions.listCampaigns.createCampaign}
          updateCampaign={actions.listCampaigns.updateCampaign}
          fetchListPattern={this.fetchListPattern}
          listBetPatterns={data.listBetPatterns}
          listLogicPatterns={data.listLogicPatterns}
          fontSize={fontSize}
          isMobile={isMobile}
          fetchSettingAdmin={this.fetchSettingAdmin}
        />
      </ModalWrapper>
    );
  }

  render() {
    const { data, actions } = this.props;
    const { isShowDetail, maxCampaign } = this.state;
    return (
      <Content>
        <ListCampaign
          listCampaigns={data.listCampaigns}
          fetchListCampaigns={actions.listCampaigns.fetchListCampaigns}
          showBotDetail={this.showCampaignDetail}
          addCampaign={this.addCampaign}
          deleteCampaign={actions.listCampaigns.deleteCampaign}
          fetchListPattern={this.fetchListPattern}
          totalCampaign={data.totalCampaign}
          maxCampaign={maxCampaign}
        />
        {isShowDetail && (
          this.renderDetailModal()
        )}
      </Content>
    );
  }
}

Campaign.propTypes = {
  data: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  fontSize: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

function mapStateToProps(state) {
  return {
    data: {
      listCampaigns: state.Campaigns.listCampaigns,
      listBetPatterns: state.Campaigns.listBetPatterns,
      listLogicPatterns: state.Campaigns.listLogicPatterns,
      totalCampaign: state.Campaigns.totalCampaign,
      userInfo: state.User,
    },
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      listCampaigns: bindActionCreators(campaignActions, dispatch),
      fetchSettingAdmin: bindActionCreators(botActions.fetchMinProfitValue, dispatch),
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Campaign);
