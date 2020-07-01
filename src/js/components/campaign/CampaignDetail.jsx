import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { convertPatternCampaign } from '../../helpers/utils';
import {
  WrapperDetail, FooterWrapper, ButtonOK,
  ButtonRevert, validCampaign, TABS, getPointRateSetting,
} from './campaignStyle';
import Spinner from '../common/Spinner';
import i18n from '../../i18n/i18n';
import TabMenu from './detail/TabMenu';
import Alert from '../common/Alert/Alert';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import TabBasicSetting from './detail/TabBasicSetting';
import TabAdvanceSetting from './detail/TabAdvanceSetting';

const listTab = [TABS.basic, TABS.advance]; // , TABS.option];
const Mode = {
  AddNew: 1,
  Edit: 2,
};

const onSuccess = (data) => {
  ApiErrorUtils.handleServerError(data, Alert.instance, () => { });
};

const validateZeroBet = (validObject, data, fieldName) => {
  const valid = { ...validObject };
  const fieldZeroCheck = (fieldName === 'win_rate_value')
    ? 'nearest_turns' : 'win_rate_value';
  if (data[fieldName] && !data[fieldZeroCheck]) {
    valid[fieldZeroCheck].isValid = false;
    valid[fieldZeroCheck].invalidText = i18n.t('fieldRequired');
  } else if (data[fieldZeroCheck] && !data[fieldName]) {
    valid[fieldName].isValid = false;
    valid[fieldName].invalidText = i18n.t('fieldRequired');
  } else {
    valid[fieldName].isValid = true;
    valid[fieldName].invalidText = '';
    valid[fieldZeroCheck].isValid = true;
    valid[fieldZeroCheck].invalidText = '';
  }
  return valid;
};

const validateMax = (validObject, value, fieldName, maxValue) => {
  const valid = { ...validObject };
  if (value > maxValue) {
    valid[fieldName].isValid = false;
    valid[fieldName].invalidText = i18n.t('fieldMax', { maxValue });
  } else if (valid[fieldName].invalidText === i18n.t('fieldMax', { maxValue })) {
    valid[fieldName].isValid = true;
    valid[fieldName].invalidText = '';
  }
  return valid;
};

const validateMaxPointRate = (validObject, value, fieldName, maxValue) => {
  const valid = { ...validObject };
  if (value > maxValue) {
    valid[fieldName].isValid = false;
    valid[fieldName].invalidText = i18n.t('fieldMax', { maxValue });
  } else {
    valid[fieldName].isValid = true;
    valid[fieldName].invalidText = '';
  }
  return valid;
};

const validateRequired = (validObject, value, fieldName) => {
  const valid = { ...validObject };
  if (value === '') {
    valid[fieldName].isValid = false;
    valid[fieldName].invalidText = i18n.t('fieldRequired');
  } else if (!valid[fieldName].isValid) {
    valid[fieldName].isValid = true;
    valid[fieldName].invalidText = '';
  }
  return valid;
};

class CampaignDetail extends Component {
  constructor(props) {
    super(props);
    let { campaignInfo } = this.props;
    if (!campaignInfo.profit_data) {
      campaignInfo = {
        ...campaignInfo,
        profit_data: {
          max_profit: 0,
          min_profit: 0,
        },
      };
    }
    const mode = campaignInfo._id ? Mode.Edit : Mode.AddNew;
    let logicBetId = -1;
    try {
      logicBetId = campaignInfo.data.components[0].logic_pattern_id;
    } catch (e) {
      logicBetId = -1;
    }

    this.state = {
      selectedTabId: TABS.basic.id,
      campaignData: JSON.parse(JSON.stringify(campaignInfo)),
      mode,
      isEdited: false,
      help: {
        fieldName: '',
        fieldContent: '',
        optionName: '',
        optionDetail: '',
      },
      isLoading: false,
      settingPointRate: getPointRateSetting(logicBetId, this.props.listLogicPatterns),
      valid: JSON.parse(JSON.stringify(validCampaign)),
    };

    this.gameSceneRef = React.createRef();
    this.onResize = this.onResize.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.onError = this.onError.bind(this);
    this.onChangeNameCampaign = this.onChangeNameCampaign.bind(this);
    this.onChangePattern = this.onChangePattern.bind(this);
    this.onChangeAdvance = this.onChangeAdvance.bind(this);
    this.onChangeBasic = this.onChangeBasic.bind(this);
    this.onRevert = this.onRevert.bind(this);
    this.onOkClick = this.onOkClick.bind(this);
    this.onClickHelp = this.onClickHelp.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    window.addEventListener('resize', this.onResize);
    this.basicTabRef = React.createRef();
  }

  componentDidMount() {
    const { fetchListPattern, fetchSettingAdmin, listLogicPatterns } = this.props;
    fetchListPattern();
    fetchSettingAdmin();
    const { campaignData } = this.state;
    // const optionName = campaignData.data.components[0].logic_pattern_name;
    const optionDeTailId = campaignData.data.components[0].logic_pattern_id;
    const optionDetail = `help.logicBet.${optionDeTailId}`;
    const object = listLogicPatterns.find(item => item.id === optionDeTailId);
    const optionDetailContent = object && object.description;
    const optionName = object && object.logic_pattern_name;
    this.onClickHelp('logicPattern', 'help.logicBet', optionName, optionDetail, optionDetailContent);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onError(error) {
    try {
      ApiErrorUtils.handleHttpError(error, Alert.instance, () => { });
    } catch (err) {
      // do something
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  }

  onResize() {
    this.setState({});
    if (this.resizeTimeOut) clearTimeout(this.resizeTimeOut);
    this.resizeTimeOut = setTimeout(() => {
      if (this.gameSceneRef.current) {
        this.gameSceneRef.current.woodPlaneRef.current.lobbyBoardRef.current.reRenderCanvas();
      }
      this.resizeTimeOut = null;
    }, 500);
  }

  onChangeTab(tabId) {
    this.setState({ selectedTabId: tabId });
  }

  onRevert() {
    const { campaignInfo } = this.props;
    let logicBetId = -1;
    try {
      logicBetId = campaignInfo.data.components[0].logic_pattern_id;
    } catch (e) {
      logicBetId = -1;
    }
    const campaignData = JSON.parse(JSON.stringify(campaignInfo));
    if (!campaignInfo.profit_data) {
      campaignData.profit_data = {
        max_profit: 0,
        min_profit: 0,
      };
    }
    this.setState({
      campaignData,
      isEdited: false,
      valid: JSON.parse(JSON.stringify(validCampaign)),
      settingPointRate: getPointRateSetting(logicBetId, this.props.listLogicPatterns),
    }, () => {
      if (this.basicTabRef.current && this.basicTabRef.current.logicRef) {
        this.basicTabRef.current.logicRef.current.resetDefaultSelected();
        this.basicTabRef.current.betRef.current.resetDefaultSelected();
      }
    });
  }

  onOkClick() {
    if (this.onValidate() === false) return;

    const checkWarning = this.checkWarningResetLogic();
    if (checkWarning === false) {
      this.saveSetting();
    } else {
      Alert.instance.showAlertTwoButtons(
        i18n.t('warning'),
        i18n.t('warning.ResetLogic'),
        [i18n.t('cancel'), i18n.t('ok')],
        [
          () => Alert.instance.hideAlert(),
          () => {
            Alert.instance.hideAlert();
            this.saveSetting();
          },
        ],
      );
    }
  }

  onSuccess(data) {
    const { onClose, fetchListCampaigns } = this.props;
    fetchListCampaigns(onSuccess, this.onError);
    this.setState({ isLoading: false });
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => onClose(),
    );
  }

  onChangeNameCampaign(event) {
    const state = { ...this.state };
    const valueInput = event.target.value;
    if (state.mode === Mode.Edit) {
      state.isEdited = true;
    }
    state.valid = validateRequired(state.valid, valueInput, 'name');
    state.campaignData.name = valueInput;
    this.setState(state);
  }

  onChangePattern(infos, fieldNameId, fieldNameText = null, fieldNameDescription = null) {
    const state = { ...this.state };
    state.campaignData.data.components[0][fieldNameId] = infos.value;
    if (fieldNameText) { state.campaignData.data.components[0][fieldNameText] = infos.text; }
    if (fieldNameDescription) {
      state.campaignData.data.components[0][fieldNameDescription] = infos.description;
    }
    if (state.mode === Mode.Edit) {
      state.isEdited = true;
    }

    if (fieldNameId === 'logic_pattern_id') {
      const setting = getPointRateSetting(infos.value, this.props.listLogicPatterns);
      state.settingPointRate = setting;
      state.valid = validateMaxPointRate(
        state.valid,
        state.campaignData.data.point_rate,
        'point_rate',
        setting.max,
      );
    }

    this.setState(state);
  }

  onChangeBasic(e, fieldName) {
    const state = { ...this.state };
    const valueInput = parseInt(e.target.value, 10) || '';
    state.campaignData.profit_data[fieldName] = valueInput;
    if (state.mode === Mode.Edit) {
      state.isEdited = true;
    }
    state.valid = validateRequired(state.valid, valueInput, fieldName);
    if (fieldName === 'point_rate') {
      if (valueInput <= state.settingPointRate.max) {
        // state.valid = validateMax(state.valid, valueInput, fieldName, state.settingPointRate.max);
        state.campaignData.data[fieldName] = valueInput;
      }
    }
    this.setState(state);
  }

  onChangeAdvance(e, fieldName) {
    const state = { ...this.state };
    const { target } = e;
    if (target.validity.valid) {
      const value = target.value ? parseInt(target.value, 10) : target.value;
      if (fieldName === 'look_rate_value') {
        state.campaignData.data.components[0][fieldName] = value;
        state.valid = validateRequired(state.valid, value, fieldName);
      } else {
        state.campaignData.data[fieldName] = value;
        if (fieldName !== 'zero_bet_mode') {
          state.valid = validateZeroBet(state.valid, state.campaignData.data, fieldName);
        }
      }
      if (fieldName === 'look_rate_value' || fieldName === 'win_rate_value') {
        state.valid = validateMax(state.valid, value, fieldName, 100);
      }
      if (state.mode === Mode.Edit) {
        state.isEdited = true;
      }
      this.setState(state);
    }
  }

  onClickHelp(fieldName, fieldContent, optionName, optionDetail, optionDetailContent = '') {
    this.setState({
      help: {
        fieldName, fieldContent, optionName, optionDetail, optionDetailContent,
      },
    });
  }

  onValidateAll() {
    const state = { ...this.state };
    const { profit_data: profitData, name, data } = state.campaignData;
    if (profitData.max_profit === 0) {
      state.valid.max_profit.isValid = false;
      state.valid.max_profit.invalidText = i18n.t('minProfitError');
    }
    if (profitData.min_profit === 0) {
      state.valid.min_profit.isValid = false;
      state.valid.min_profit.invalidText = i18n.t('minProfitError');
    }
    if (!name) {
      state.valid.name.isValid = false;
      state.valid.name.invalidText = i18n.t('fieldRequired');
    }
    if (data.nearest_turns && !data.win_rate_value) {
      state.valid.win_rate_value.isValid = false;
      state.valid.win_rate_value.invalidText = i18n.t('fieldRequired');
    }
    if (data.win_rate_value && !data.nearest_turns) {
      state.valid.nearest_turns.isValid = false;
      state.valid.nearest_turns.invalidText = i18n.t('fieldRequired');
    }
    this.setState(state);
  }

  onValidate() {
    const { valid } = this.state;
    this.onValidateAll();
    const keyError = Object.keys(valid).find(key => !valid[key].isValid);
    if (keyError) {
      this.onChangeTab(valid[keyError].tabId);
      return false;
    }
    return true;
  }

  getSettingPointRate(logicBetId) {
    return getPointRateSetting(logicBetId, this.props.listLogicPatterns);
  }

  saveSetting() {
    const { createCampaign, updateCampaign, onClose } = this.props;
    const { campaignData, mode, isEdited } = this.state;
    if (mode === Mode.Edit && isEdited) {
      this.setState({ isLoading: true });
      updateCampaign(campaignData, this.onSuccess, this.onError);
    } else if (mode === Mode.AddNew) {
      this.setState({ isLoading: true });
      createCampaign(campaignData, this.onSuccess, this.onError);
    } else {
      onClose();
    }
  }

  checkWarningResetLogic() {
    const { mode } = this.state;
    if (mode === Mode.AddNew) return false;

    const { campaignInfo } = this.props;
    const nowData = this.state.campaignData;
    return !(campaignInfo.data.components[0].logic_pattern_id
      === nowData.data.components[0].logic_pattern_id);
  }

  render() {
    const {
      listBetPatterns, listLogicPatterns,
      fontSize, isMobile,
    } = this.props;
    const {
      selectedTabId, campaignData, valid,
      isEdited, isLoading, help, settingPointRate,
    } = this.state;
    const optionLogicPatterns = convertPatternCampaign(listLogicPatterns, campaignData.data.components[0], 'logic_pattern_name');
    const optionBetPatterns = convertPatternCampaign(listBetPatterns, campaignData.data.components[0], 'bet_pattern_name');
    let maxWidth = optionLogicPatterns.maxWidth > optionBetPatterns.maxWidth
      ? optionLogicPatterns.maxWidth : optionBetPatterns.maxWidth;
    maxWidth = maxWidth / 18 + 4;
    return (
      <WrapperDetail isMobile={isMobile} fontSize={fontSize}>
        <TabMenu
          tabs={listTab}
          onChangeTab={this.onChangeTab}
          selectTedId={selectedTabId}
        />
        {
          selectedTabId === TABS.basic.id && (
            <TabBasicSetting
              valid={valid}
              campaignData={campaignData}
              onChangeNameCampaign={this.onChangeNameCampaign}
              helpData={help}
              onClickHelp={this.onClickHelp}
              onChangePattern={this.onChangePattern}
              onChangeBasic={this.onChangeBasic}
              listBetPatterns={listBetPatterns}
              listLogicPatterns={listLogicPatterns}
              isMobile={isMobile}
              ref={this.basicTabRef}
              settingPointRate={settingPointRate}
              optionLogicPatterns={optionLogicPatterns}
              optionBetPatterns={optionBetPatterns}
              maxWidth={maxWidth}
            />
          )
        }
        {
          selectedTabId === TABS.advance.id && (
            <TabAdvanceSetting
              valid={valid}
              campaignData={campaignData}
              isMobile={isMobile}
              helpData={help}
              onClickHelp={this.onClickHelp}
              // onChangeCheckSuper6={this.onChangeCheckSuper6}
              // onChangeTypeOptionBanker={this.onChangeTypeOptionBanker}
              onChangeAdvance={this.onChangeAdvance}
              maxWidth={maxWidth}
            />
          )
        }

        <FooterWrapper>
          {
            isEdited && <ButtonRevert onClick={this.onRevert}>{i18n.t('revert')}</ButtonRevert>
          }
          <ButtonOK onClick={this.onOkClick}>
            {isEdited ? i18n.t('save') : i18n.t('ok')}
          </ButtonOK>
        </FooterWrapper>
        <Spinner isLoading={isLoading} />
      </WrapperDetail>
    );
  }
}

CampaignDetail.defaultProps = {
  onClose: null,
};

CampaignDetail.propTypes = {
  campaignInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  onClose: PropTypes.func,
  createCampaign: PropTypes.func.isRequired,
  updateCampaign: PropTypes.func.isRequired,
  fetchListCampaigns: PropTypes.func.isRequired,
  fetchListPattern: PropTypes.func.isRequired,
  listBetPatterns: PropTypes.array.isRequired,
  listLogicPatterns: PropTypes.array.isRequired,
  fontSize: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
  fetchSettingAdmin: PropTypes.func.isRequired,
};

export default CampaignDetail;
