import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled from 'styled-components';
import * as DepositActions from '../../actions/Deposit';
import * as tableActions from '../../actions/table';
import iconX from '../../../assets/imgs/icon_x.png';
import i18n from '../../i18n/i18n';
import { convertTableOption } from '../../helpers/utils';
import {
  Wrapper, AlertStyled, CloseButton,
  Content, Message,
} from './Alert/alertStyle';
import { ButtonCore } from '../mainContainer/mainStyle';
import { ORIENT, getOrientation } from '../../helpers/orientation';
import InputFloatField from './InputFloatField';
import ChangeBotCampaign from '../botDetail/ChangeBotCampaign';
import DropDownTextField from './Dropdown/DropDownTextField';
import Alert from './Alert/Alert';
import Spinner from './Spinner';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import RadioButton from './RadioButton';
import checkedCheckBox from '../../../assets/img/check_box_checked.png';
import uncheckCheckBox from '../../../assets/img/check_box_uncheck.png';

const ButtonConfirm = styled.div`
  display: flex;
`;

const Checkbox = styled.div`
  background-image: url(${props => (props.isChecked ? checkedCheckBox : uncheckCheckBox)});
  background-size: 100% 100%;
  margin-right: 10px;
  width: 15px;
  height: 15px;
`;

const WrapperOnBot = styled(Wrapper)`
  z-index: 1;
`;

const MessageContent = styled(Message)`
  font-size: 1.2em;
  margin-right: 1em;
  margin-left: ${props => props.marginLeft}em;
  width: ${props => (props.width ? props.width : 7)}em;
  text-align: ${props => (props.textAlign ? props.textAlign : 'end')};
`;

const ContentItem = styled.div`
  color: #fff;
  display: flex;
  align-items: center;
  margin-top: ${props => (props.marginTop ? props.marginTop : 1.5)}em;
`;

const ContentPopup = styled.div`
  color: #fff;
  font-size: ${props => props.fontSize}em;
  margin-bottom: 0.5em;
`;

const ActionPopup = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin-top: 1.5em;
`;


const WrapperConfirm = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const ContentConfirm = styled.div`
  width: 90%;
  background-color: rgb(255, 255, 255);
  border: 0.25em solid rgb(136, 136, 136);
  padding: 0.2em;
  font-size: 0.8em;
  margin-top: 1em;
`;

const CheckboxConfirm = styled.div`
  display: flex;
  color: red;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const MessageConfirm = styled.div`
  color: red;
  white-space: pre-wrap;
  text-align: center;
  font-size: 0.9em;
`;

const BET_POINT = 10;

const checkOffPointRate = (botInfo) => {
  if (!botInfo) return null;
  if (!botInfo.campaign) return null;
  if (!botInfo.campaign.profit_data) return null;
  if (!botInfo.campaign.data) return null;
  const minProfit = botInfo.campaign.profit_data.min_profit || 0;
  const pointRate = botInfo.campaign.data.point_rate || 0;
  // const money = botInfo.GC || 0;

  if (minProfit < (pointRate * BET_POINT)) return i18n.t('onBot.AutoOff.MinProfit');
  // if (money < (pointRate * BET_POINT)) return i18n.t('onBot.AutoOff.NotEnough');
  return null;
};

const onSuccess = (data) => {
  ApiErrorUtils.handleServerError(data, Alert.instance, () => { });
};

class PopupOnBot extends Component {
  constructor(props) {
    super(props);
    const { listTable, bot } = this.props;
    this.state = {
      orientation: getOrientation(),
      onAnimation: false,
      bot,
      isConfirmResetLogic: false,
      isChangeCampaign: false,
      isChangeTable: false,
      isChangeGc: false,
      isResetLogic: true,
      isLoading: false,
      isValidCampaign: true,
      isValidTable: true,
      isValidGC: true,
      isCheckNotice: false,
      isTableFull: false,
      clientTableSelect: listTable[0] || {
        id: null,
        name: null,
      },
      clientTableDefault: listTable[0] || {
        id: null,
        name: null,
      },
    };

    this.timeOutOnBot = null;
    this.timeOutOnBotCount = 0;
    this.stop = this.stop.bind(this);

    this.updateBotStatus = this.updateBotStatus.bind(this);
    this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
    this.onOrientationChange = this.onOrientationChange.bind(this);
    this.onClickResetLogic = this.onClickResetLogic.bind(this);
    this.handleChangeBotCampaign = this.handleChangeBotCampaign.bind(this);
    this.handleChangeBotTable = this.handleChangeBotTable.bind(this);
    this.handleCharge = this.handleCharge.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.fetchBotDetail = this.fetchBotDetail.bind(this);
    this.onSuccessCharge = this.onSuccessCharge.bind(this);
    this.onSuccessUpdateBotStatus = this.onSuccessUpdateBotStatus.bind(this);
    this.onError = this.onError.bind(this);
    window.addEventListener('orientationchange', this.onOrientationChange);
    this.timeOutRefreshData = null;
  }

  componentDidMount() {
    const { bot, fetchBotDetail, fetchListTable } = this.props;
    this.setState({ bot });
    fetchListTable(onSuccess, this.onError);
    fetchBotDetail(bot.id, (data) => {
      this.setState({
        bot: JSON.parse(JSON.stringify(data.data)),
      });
      if (data.data.table_id) {
        this.setState({
          clientTableSelect: {
            id: data.data.table_id,
            name: data.data.table_name,
          },
        });
      }
    }, () => { });
  }

  componentWillUnmount() {
    this.stop();
    if (this.timeOutRefreshData) clearTimeout(this.timeOutRefreshData);
  }

  onSuccessCharge(data) {
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => {
        Alert.instance.showAlert(i18n.t('success'), data.message);
      },
    );
    this.props.fetchUser(
      userData => ApiErrorUtils.handleServerError(
        userData, Alert.instance, () => { }, () => { },
      ),
      err => ApiErrorUtils.handleHttpError(err, Alert.instance, () => { }),
    );
    this.fetchBotDetail();
    this.props.fetchListBots();
    this.setState({ isLoading: false });
  }

  onError(error) {
    ApiErrorUtils.handleHttpError(error, Alert.instance);
    this.setState({ isLoading: false });
  }

  onSuccessUpdateBotStatus(data) {
    const { fetchListBots, onClose } = this.props;
    if (data.status === 0) { // when onBot will return status if is waiting
      if (this.timeOutOnBotCount > 5) {
        this.timeOutOnBotCount = 0;
        Alert.instance.showAlert(i18n.t('error'), i18n.t('onBotError'));
        this.setState({ isLoading: false });
        return;
      }
      this.timeOutOnBot = setTimeout(() => this.updateBotStatus(), 1000);
    } else {
      this.stop();
      ApiErrorUtils.handleServerError(data, Alert.instance);
      this.setState({ isLoading: false });
      this.fetchBotDetail();
      fetchListBots();
      onClose();
    }
  }

  onClickCheckbox(type) {
    const isCheck = this.state[type];
    this.setState({
      [type]: !isCheck,
    });
  }

  onClickResetLogic(value) {
    this.setState({ isResetLogic: value });
  }

  onOrientationChange() {
    const newOrientation = getOrientation();
    const { orientation } = this.state;
    if (orientation !== newOrientation) {
      this.setState({ orientation: newOrientation });
    }
  }

  fetchBotDetail() {
    const { fetchBotDetail } = this.props;
    const { bot } = this.state;
    fetchBotDetail(bot.id, (data) => {
      this.setState({
        bot: JSON.parse(JSON.stringify(data.data)),
      });
    }, () => { });
  }

  handleAnimationEnd() {
    this.setState({ onAnimation: false });
  }

  handleChangeBotCampaign(value) {
    const { updateBotCampaign, fetchListBots } = this.props;
    const { bot } = this.state;
    if (value) {
      this.setState({ isValidCampaign: true });
    }
    updateBotCampaign(bot.id, value, () => {
      this.fetchBotDetail();
      fetchListBots();
    }, () => {
    });
  }

  handleChangeBotTable(optionSelected, callBack = null, isShowMessage = true) {
    const { actions, fetchListBots, fetchListTable } = this.props;
    const { bot } = this.state;
    if (optionSelected.color) {
      this.setState({ isValidTable: true });
    }
    const params = {
      auto_id: bot.id,
      table_id: optionSelected.id,
    };
    this.setState({ isLoading: true });
    actions.selectTable((data) => {
      ApiErrorUtils.handleServerError(
        data,
        Alert.instance,
        () => {
          this.timeOutRefreshData = setTimeout(() => {
            this.fetchBotDetail();
            fetchListBots();
            this.setState({
              isLoading: false,
              clientTableSelect: {
                id: optionSelected.id,
                name: optionSelected.name,
              },
              clientTableDefault: {
                id: optionSelected.id,
                name: optionSelected.name,
              },
            }, () => {
              if (callBack) callBack();
            });
            this.timeOutRefreshData = null;
            if (isShowMessage === true) {
              fetchListTable(onSuccess, this.onError);
              Alert.instance.showAlert(i18n.t('success'), data.message);
            }
          }, 1000);
        },
        () => {
          this.setState({
            isLoading: false,
          });
        },
      );
    }, this.onError, params);
  }

  handleChangeState(value, fieldName) {
    this.setState({ [fieldName]: value });
  }

  handleCharge(gc) {
    const { actions } = this.props;
    const { bot } = this.state;
    const gcAmount = Math.round((gc - bot.GC) * 100) / 100;
    const amount = gcAmount.toLocaleString('ja');
    if (gc) {
      this.setState({ isValidGC: true });
    }
    Alert.instance.showAlertTwoButtons(
      i18n.t('warning'),
      i18n.t('chargeGcBot', { amount }),
      [i18n.t('cancel'), i18n.t('OK')],
      [
        () => Alert.instance.hideAlert(),
        () => {
          this.setState({ isLoading: true });
          actions.chargeAction([bot.id], gcAmount, this.onSuccessCharge, this.onError);
          Alert.instance.hideAlert();
        },
      ],
      Alert.instance.hideAlert(),
    );
  }

  handleUpdateBotStatus() {
    const { clientTableSelect, isConfirmResetLogic } = this.state;
    if (
      (clientTableSelect.id !== null && clientTableSelect.id !== undefined)
      && !isConfirmResetLogic
      && clientTableSelect.id !== this.state.bot.table_id
      && this.validate()
    ) {
      Alert.instance.showAlertTwoButtons(
        i18n.t('warning'),
        i18n.t('confirmSaveTable', { table: clientTableSelect.name }),
        [i18n.t('cancel'), i18n.t('OK')],
        [
          () => Alert.instance.hideAlert(),
          () => {
            this.handleChangeBotTable(clientTableSelect, this.updateBotStatus, false);
            Alert.instance.hideAlert();
          },
        ],
        Alert.instance.hideAlert(),
      );
    } else {
      this.updateBotStatus();
    }
  }

  updateBotStatus() {
    const { isConfirmResetLogic, bot, isResetLogic } = this.state;
    const { updateBotStatus } = this.props;
    if (!bot.reset_logic && !isConfirmResetLogic && this.validate()) {
      this.setState({ isConfirmResetLogic: true, isResetLogic: '' });
    } else {
      const checkAutoOff = checkOffPointRate(bot);
      if (checkAutoOff) {
        Alert.instance.showAlert(i18n.t('warning'), checkAutoOff);
        return;
      }
      if (this.validate()) {
        this.setState({ isLoading: true });
        this.stop();
        const status = bot.status ? 0 : 1;
        this.timeOutOnBotCount = this.timeOutOnBotCount + 1;
        updateBotStatus(
          bot.id, status, isResetLogic,
          this.onSuccessUpdateBotStatus, this.onError,
        );
      }
    }
  }

  stop() {
    if (this.timeOutOnBot) clearTimeout(this.timeOutOnBot);
    this.timeOutOnBot = null;
  }

  validate() {
    const {
      bot, isChangeGc,
      isChangeCampaign, isTableFull,
    } = this.state;
    if (!bot.campaign) {
      this.setState({ isValidCampaign: false });
    }
    if (!bot.GC) {
      this.setState({ isValidGC: false });
    }
    if (isChangeCampaign) {
      this.setState({ isValidCampaign: false });
    }
    if (isChangeGc) {
      this.setState({ isValidGC: false });
    }
    if (isTableFull) {
      return false;
    }
    if (bot.campaign && bot.GC && !isChangeGc && !isChangeCampaign) {
      return true;
    }
    return false;
  }

  renderButtons() {
    const {
      isResetLogic, bot,
      isCheckNotice, clientTableSelect,
      isTableFull,
    } = this.state;
    const { onClose } = this.props;
    const checkTable = bot.table_id || (clientTableSelect.id !== null);
    const isDisable = isCheckNotice && isResetLogic !== '' && checkTable && !isTableFull;
    return (
      <React.Fragment>
        <ActionPopup>
          <ButtonConfirm>
            <ButtonCore
              fontSize="1.1em"
              hoverBgColor="#20bcdf"
              color="#2d889c"
              padding="0 1em 0 1em"
              onClick={() => onClose()}
              height="3em"
              width="7em"
            >
              {i18n.t('back')}
            </ButtonCore>
            <ButtonCore
              style={{
                cursor: isDisable ? 'pointer' : 'not-allowed',
              }}
              fontSize="1.1em"
              hoverBgColor={isDisable ? '#20bcdf' : '#ccc'}
              color={isDisable ? '#23B083' : '#ccc'}
              margin=" 0 0 0 2em"
              padding="0 1em 0 1em"
              height="3em"
              width="7em"
              onClick={() => {
                if (!isDisable) return;
                this.handleUpdateBotStatus();
              }}
            >
              {i18n.t('onBot')}
            </ButtonCore>
          </ButtonConfirm>
        </ActionPopup>
      </React.Fragment>
    );
  }

  renderConfirmResetLogic() {
    const { isMobile } = this.props;
    const { isResetLogic } = this.state;
    const isChecked = isResetLogic === '' ? null : !isResetLogic;
    return (
      <Content>
        <Message
          whiteSpace={!isMobile && 'pre-line'}
          fontSize={1.5}
          fontWeight={600}
        >
          {i18n.t('resetLogicConfirm')}
        </Message>
        <ContentPopup fontSize={isMobile && 0.8}>
          <ContentItem marginTop={5}>
            <RadioButton
              isChecked={isResetLogic}
              onChange={() => this.onClickResetLogic(true)}
            />
            <MessageContent
              width={23}
              textAlign="start"
              marginLeft={1}
              onClick={() => this.onClickResetLogic(true)}
            >
              {i18n.t('resetLogic')}
            </MessageContent>
          </ContentItem>
          <ContentItem marginTop={2}>
            <RadioButton
              isChecked={isChecked}
              onChange={() => this.onClickResetLogic(false)}
            />
            <MessageContent
              width={23}
              textAlign="start"
              marginLeft={1}
              onClick={() => this.onClickResetLogic(false)}
            >
              {i18n.t('notResetLogic')}
            </MessageContent>
          </ContentItem>
          <ContentItem marginTop={2}>
            <MessageConfirm marginLeft={1} onClick={() => this.onClickResetLogic(false)}>
              {i18n.t('nodeResetLogic')}
            </MessageConfirm>
          </ContentItem>
        </ContentPopup>
      </Content>
    );
  }

  renderSettingBot() {
    const {
      listCampaigns, lucUserGC,
      isMobile, listTable,
    } = this.props;
    const {
      bot, isValidCampaign,
      isValidGC, isCheckNotice,
      isValidTable, clientTableDefault,
    } = this.state;
    if (!bot) return null;
    const botGc = bot.GC;
    const maxValue = Math.trunc((botGc + lucUserGC) * 100) / 100;
    return (
      <Fragment>
        <Content>
          <Message
            whiteSpace={!isMobile && 'pre-line'}
            fontSize={1.5}
            fontWeight={600}
          >
            {i18n.t('onBotMessage')}
          </Message>
          <ContentPopup fontSize={isMobile ? 0.8 : 0.9}>
            <ContentItem>
              <MessageContent>
                {i18n.t('campaign')}:
              </MessageContent>
              <ChangeBotCampaign
                campaignBot={bot.campaign || {}}
                updateBotCampaign={this.handleChangeBotCampaign}
                isChangeBotCampaign
                listCampaigns={listCampaigns}
                isError={!isValidCampaign}
                fontSize={1}
                handleChangeProps={this.handleChangeState}
              />
            </ContentItem>
            <ContentItem>
              <MessageContent>
                {i18n.t('table')}:
              </MessageContent>
              <DropDownTextField
                submitOption={this.handleChangeBotTable}
                listOption={listTable}
                optionDefault={{
                  id: bot.table_id || clientTableDefault.id,
                  name: bot.table_name || clientTableDefault.name,
                }}
                idDefault={bot.table_id}
                isError={!isValidTable}
                fontSize={1}
                handleChangeProps={this.handleChangeState}
                titleSubmit="confirmSaveTable"
                convertDataOption={convertTableOption}
                isChangeOptionName="isChangeTable"
                isValidOptionName="isValidTable"
                messageError={i18n.t('tableFull')}
                isChangeOption
                isShowDropdown={!bot.table_id}
                handleChangeValue={value => this.setState({ clientTableSelect: { ...value } })}
              />
            </ContentItem>
            <ContentItem marginTop={2}>
              <MessageContent>
                {i18n.t('gc')}:
              </MessageContent>
              <InputFloatField
                handleChangeInput={this.handleCharge}
                valueDefault={botGc}
                minValue={botGc}
                maxValue={maxValue}
                type="number"
                fontSize={1.2}
                isError={!isValidGC}
                handleChangeProps={this.handleChangeState}
                placeholder={i18n.t('placeholderChargeGC')}
              />
            </ContentItem>
          </ContentPopup>
        </Content>
        <WrapperConfirm>
          <ContentConfirm>
            <CheckboxConfirm onClick={() => this.onClickCheckbox('isCheckNotice')}>
              <Checkbox
                isChecked={isCheckNotice}
                onClick={() => this.onClickCheckbox('isCheckNotice')}
              />
              <span>
                {i18n.t('noticeOnBot1')}
              </span>
            </CheckboxConfirm>
            <MessageConfirm>
              {i18n.t('noticeOnBot2')}
            </MessageConfirm>
          </ContentConfirm>
        </WrapperConfirm>
      </Fragment>
    );
  }

  render() {
    const { onClose } = this.props;
    const {
      orientation, onAnimation, isLoading,
      bot, isConfirmResetLogic,
    } = this.state;
    if (!bot) return null;
    const width = orientation === ORIENT.HORIZONTAL ? '40em' : '80%';
    return (
      <WrapperOnBot className="alertClass">
        <AlertStyled
          onAnimationEnd={this.handleAnimationEnd}
          isAnimation={onAnimation}
          width={width}
          maxWidth="90%"
          id="Alert"
        >
          <CloseButton
            src={iconX}
            onClick={() => onClose()}
          />
          {isConfirmResetLogic ? this.renderConfirmResetLogic() : this.renderSettingBot()}
          {this.renderButtons()}
        </AlertStyled>
        <Spinner isLoading={isLoading} />
      </WrapperOnBot>
    );
  }
}

PopupOnBot.propTypes = {
  onClose: PropTypes.func.isRequired,
  updateBotCampaign: PropTypes.func.isRequired,
  listCampaigns: PropTypes.array.isRequired,
  listTable: PropTypes.array.isRequired,
  fetchBotDetail: PropTypes.func.isRequired,
  fetchListBots: PropTypes.func.isRequired,
  fetchListTable: PropTypes.func.isRequired,
  updateBotStatus: PropTypes.func.isRequired,
  actions: PropTypes.object.isRequired,
  lucUserGC: PropTypes.number.isRequired,
  fetchUser: PropTypes.func.isRequired,
  bot: PropTypes.object.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

const mapDispatchToProps = dispatch => ({
  actions: {
    chargeAction: bindActionCreators(DepositActions.gift, dispatch),
    selectTable: bindActionCreators(tableActions.selectTable, dispatch),
  },
});

export default connect(null, mapDispatchToProps)(PopupOnBot);
