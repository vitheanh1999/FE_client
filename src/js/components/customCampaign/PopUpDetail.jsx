import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import {
  WrapperDetail, Column, Blank,
} from '../campaign/campaignStyle';
import Spinner from '../common/Spinner';
import i18n from '../../i18n/i18n';
import Alert from '../common/Alert/Alert';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import {
  TitleGroup, Wrapper, renderButtonHelp, Row, WrapperTable,
} from '../campaign/detail/tabBasicSettingStyle';
import FormCampaign from '../campaign/detail/FormCampaign';
import { LOGIC_PATTERN_DEFAULT_DATA, BET_PATTERN_DEFAULT_DATA } from '../../constants/customCampaign';
import { TABS } from './CardNoTable';
import TextAreaWithTruncate from '../common/TextAreaWithTruncate';
import SettingCardNoTable, { CUSTOM_MODE } from './SettingCardNoTable';
import Keyboard from '../keyboard/Keyboard';
import AutoSave, { AUTO_SAVE_KEY } from '../../helpers/AutoSave';
import { refreshToken } from '../../helpers/utils';
import StorageUtils, { STORAGE_KEYS } from '../../helpers/StorageUtils';

const Notice = styled(Blank)`
  color: red;
  margin-left: 1em;
  display: flex;
  align-items: center;
`;

const Mode = {
  AddNew: 1,
  Edit: 2,
};

const validateRequired = (value) => {
  if (value === '') {
    return i18n.t('fieldRequired');
  }
  return '';
};

class PopUpDetail extends Component {
  constructor(props) {
    super(props);
    const { selectTedId, type } = this.props;
    let mode = '';
    let dataInfoPopup = null;
    if (selectTedId) {
      mode = Mode.Edit;
    } else {
      mode = Mode.AddNew;
      if (type === TABS.LIST_LOGIC_BET.id) {
        dataInfoPopup = {
          logic_pattern_name: '',
          description: '',
          card_nos: JSON.parse(JSON.stringify(LOGIC_PATTERN_DEFAULT_DATA)),
        };
      } else {
        dataInfoPopup = {
          bet_pattern_name: '',
          description: '',
          card_nos: JSON.parse(JSON.stringify(BET_PATTERN_DEFAULT_DATA)),
        };
      }
    }

    this.state = {
      isLoading: false,
      mode,
      helpData: {
        fieldName: '',
        fieldContent: '',
        optionName: '',
        optionDetail: '',
      },
      errorMessageName: '',
      errorMessageDesc: '',
      dataInfoPopup,
      isValidData: false,
      haveChange: false,
      haveChangeCardNo: false,
    };

    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);

    this.onResize = this.onResize.bind(this);
    this.onRevert = this.onRevert.bind(this);
    this.cardNoTableRef = createRef();
    this.onSaveDraft = this.onSaveDraft.bind(this);
    this.onBlurNameInput = this.onBlurNameInput.bind(this);
    this.onSave = this.onSave.bind(this);
    window.addEventListener('resize', this.onResize);
    this.interval = null;
  }

  componentWillMount() {
    const { selectTedId, type, getDataPopUp } = this.props;
    let dataInfoPopup = null;
    if (AutoSave.instance.checkDraft(AUTO_SAVE_KEY.popupDetail)) {
      const state = AutoSave.instance.getDraftContent(AUTO_SAVE_KEY.popupDetail);
      this.setState(state);
      return;
    }
    if (selectTedId) {
      this.setState({ isLoading: true });
      getDataPopUp(selectTedId, (data) => {
        ApiErrorUtils.handleServerError(
          data,
          Alert.instance,
          () => {
            this.setState({
              dataInfoPopup: JSON.parse(JSON.stringify(data.data)),
              cloneDataInfoPopup: JSON.parse(JSON.stringify(data.data)),
              isLoading: false,
            });
          },
        );
      }, this.onError);
    } else if (type === TABS.LIST_LOGIC_BET.id) {
      dataInfoPopup = {
        logic_pattern_name: '',
        description: '',
        card_nos: JSON.parse(JSON.stringify(LOGIC_PATTERN_DEFAULT_DATA)),
      };
    } else {
      dataInfoPopup = {
        bet_pattern_name: '',
        description: '',
        card_nos: JSON.parse(JSON.stringify(BET_PATTERN_DEFAULT_DATA)),
      };
    }
    this.setState({
      dataInfoPopup,
      cloneDataInfoPopup: JSON.parse(JSON.stringify(dataInfoPopup)),
    });
  }

  componentDidMount() {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      refreshToken(() => clearInterval(this.interval));
    }, 60 * 1000);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
    clearInterval(this.interval);
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
  }

  onRevert() {
    const { cloneDataInfoPopup } = this.state;
    this.setState({
      dataInfoPopup: JSON.parse(JSON.stringify(cloneDataInfoPopup)),
      errorMessageName: '',
      haveChange: false,
    }, () => {
      this.validateData();
    });
  }

  onSave(listCardNos, haveChangeCardNo) {
    StorageUtils.setSectionStorageItem(STORAGE_KEYS.hasAction, true);

    const {
      createOrUpdateData, onClose, totalBotOffInData, totalBotOnInData,
    } = this.props;
    const {
      dataInfoPopup, mode, isLoading, cloneDataInfoPopup,
    } = this.state;
    const newData = { ...dataInfoPopup };
    newData.card_nos = listCardNos;
    const haveChange = !(JSON.stringify(newData) === JSON.stringify(cloneDataInfoPopup));
    if (mode === Mode.AddNew || haveChange) {
      if (this.validateData()) {
        if (totalBotOffInData && haveChangeCardNo && mode === Mode.Edit && totalBotOnInData === 0) {
          Alert.instance.showAlertTwoButtons(
            i18n.t('warning'),
            i18n.t('warningChangeDataResetBot'),
            [i18n.t('cancel'), i18n.t('ok')],
            [
              () => Alert.instance.hideAlert(), !isLoading ? () => {
                Alert.instance.hideAlert();
                this.setState({ isLoading: true });
                createOrUpdateData(newData, this.onSuccess, this.onError);
                AutoSave.instance.deleteDraft();
              } : null,
            ],
          );
        } else {
          this.setState({ isLoading: true });
          createOrUpdateData(newData, this.onSuccess, this.onError);
        }
      }
    } else onClose(false);
  }

  onSaveDraft() {
    AutoSave.instance.saveDraft(AUTO_SAVE_KEY.popupDetail, this.state);
  }

  onSuccess(data) {
    const { onClose, callbackFetchData, currentPage } = this.props;
    this.setState({ isLoading: false });
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => {
        onClose(false);
        callbackFetchData(currentPage);
      },
    );
  }

  onChangeInput(event, field) {
    StorageUtils.setSectionStorageItem(STORAGE_KEYS.hasAction, true);

    const { type } = this.props;
    const state = { ...this.state };
    state.haveChange = true;
    let valueInput = event.target.value;
    const { dataInfoPopup } = state;
    if (field === 'name') {
      dataInfoPopup[type === TABS.LIST_LOGIC_BET.id ? 'logic_pattern_name' : 'bet_pattern_name'] = valueInput;
      state.errorMessageName = validateRequired(valueInput);
    } else {
      if (valueInput.length > 1000) {
        valueInput = valueInput.slice(0, 1000);
      }
      dataInfoPopup.description = valueInput;
    }
    this.setState(state, () => this.onSaveDraft());
  }

  onBlurNameInput() {
    const { type } = this.props;
    const state = { ...this.state };
    const { dataInfoPopup } = state;
    const name = dataInfoPopup[type === TABS.LIST_LOGIC_BET.id ? 'logic_pattern_name' : 'bet_pattern_name'];
    dataInfoPopup[type === TABS.LIST_LOGIC_BET.id ? 'logic_pattern_name' : 'bet_pattern_name'] = name.trim();
    this.setState(state);
  }

  checkChangeData() {
    const {
      dataInfoPopup, cloneDataInfoPopup,
    } = this.state;
    return !(JSON.stringify(dataInfoPopup) === JSON.stringify(cloneDataInfoPopup))
      || this.cardNoTableRef.current.checkChangeData();
  }

  validateData() {
    const isValidCardNoData = this.cardNoTableRef.current.validateAll();
    const { dataInfoPopup } = this.state;
    const { type } = this.props;
    const errorMessageName = validateRequired(dataInfoPopup[type === TABS.LIST_LOGIC_BET.id ? 'logic_pattern_name' : 'bet_pattern_name']);
    this.setState({
      errorMessageName,
    });
    if (errorMessageName || !isValidCardNoData) return false;
    return true;
  }

  creatButtonHelp(fieldName, fieldContent, optionName, optionDetail, optionDescription = null) {
    const { helpData } = this.state;
    return renderButtonHelp(fieldName, helpData.fieldName, () => {
      this.setState({
        helpData: {
          fieldName, fieldContent, optionName, optionDetail, optionDescription,
        },
      });
    });
  }

  render() {
    const {
      isLoading, errorMessageName,
      dataInfoPopup,
    } = this.state;
    const {
      fontSize, isMobile, type, settingWorkerData,
      changeMarginBottom, totalBotOnInData,
    } = this.props;
    return (
      <WrapperDetail isMobile={isMobile} fontSize={fontSize}>
        <Wrapper
          isMobile={isMobile}
          style={{ borderBottom: 0 }}
        >
          <Column style={{ width: '100%' }}>
            {
              totalBotOnInData
                ? (
                  <Notice height={2}>{i18n.t('noticeChangeDataWhenHasBotOn')}</Notice>
                ) : (
                  <Blank height={2} />
                )
            }
            <Row>
              <TitleGroup>
                {i18n.t(`${type === TABS.LIST_LOGIC_BET.id ? 'customCampaign.logicPatternName' : 'customCampaign.betPatternName'}`).concat(':')}
              </TitleGroup>
            </Row>
            <Row>
              <FormCampaign
                onChange={e => this.onChangeInput(e, 'name')}
                onBlur={this.onBlurNameInput}
                isValid={errorMessageName === ''}
                invalidText={errorMessageName}
                margin={errorMessageName === '' ? '0 0 0 1em' : '1em 0 0 1em'}
                name="name"
                maxLength={20}
                labelPaddingBottom={4}
                value={(dataInfoPopup && dataInfoPopup[type === TABS.LIST_LOGIC_BET.id ? 'logic_pattern_name' : 'bet_pattern_name']) || ''}
                customStyle={{ width: '100%', marginLeft: '1em', marginRight: '1em' }}
                width="unset"
                onFocus={() => {
                  Keyboard.instance.hideKeyboard();
                  changeMarginBottom(0);
                }}
                disabled={!!totalBotOnInData}
              />
            </Row>
            <Blank height={1} />
            <Row>
              <TitleGroup width={20}>
                {i18n.t('customCampaign.description').concat(i18n.t('customCampaign.descriptionNoti').concat(':'))}
              </TitleGroup>
            </Row>
            <Row>
              <TextAreaWithTruncate
                onChange={e => this.onChangeInput(e, 'description')}
                value={(dataInfoPopup && dataInfoPopup.description) || ''}
                onFocus={() => {
                  Keyboard.instance.hideKeyboard();
                  changeMarginBottom(0);
                }}
                disabled={!!totalBotOnInData}
              />
            </Row>
            <Blank height={1} />
            <Row style={{ justifyContent: 'space-between' }}>
              <TitleGroup>
                {i18n.t('customCampaign.cardNoSetting').concat(':')}
              </TitleGroup>
            </Row>
            <Row>
              <WrapperTable>
                <SettingCardNoTable
                  cardNoData={dataInfoPopup ? dataInfoPopup.card_nos : []}
                  onSave={this.onSave}
                  mode={type === TABS.LIST_LOGIC_BET.id ? CUSTOM_MODE.LOGIC : CUSTOM_MODE.BET}
                  ref={this.cardNoTableRef}
                  settingWorkerData={settingWorkerData}
                  changeMarginBottom={changeMarginBottom}
                  onSaveDraft={this.onSaveDraft}
                  disabled={!!totalBotOnInData}
                />
              </WrapperTable>
            </Row>
          </Column>
        </Wrapper>
        <Spinner isLoading={isLoading} />
      </WrapperDetail>
    );
  }
}

PopUpDetail.defaultProps = {
  onClose: null,
  selectTedId: null,
};

PopUpDetail.propTypes = {
  onClose: PropTypes.func,
  fontSize: PropTypes.number.isRequired,
  isMobile: PropTypes.bool.isRequired,
  selectTedId: PropTypes.number,
  createOrUpdateData: PropTypes.func.isRequired,
  type: PropTypes.number.isRequired,
  callbackFetchData: PropTypes.func.isRequired,
  settingWorkerData: PropTypes.object.isRequired,
  getDataPopUp: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalBotOffInData: PropTypes.number.isRequired,
  totalBotOnInData: PropTypes.number.isRequired,
  changeMarginBottom: PropTypes.func.isRequired,
};

export default PopUpDetail;
