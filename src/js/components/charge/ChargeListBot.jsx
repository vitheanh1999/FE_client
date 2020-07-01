import React, { Component } from 'react';
import PropsType from 'prop-types';
import Pagination from 'rc-pagination';
import {
  WrapperBot, WrapperTitleCharge, Label, ChargeButton, Footer, WrapperNotification, InlineDiv,
  CheckBox,
} from './ChargeStyle';
import i18n from '../../i18n/i18n';
import DropDown from '../common/Dropdown/Dropdown';
import {
  WrapperStatus, ButtonStatus, WrapperPaginationCustom, WrapperSpan,
} from '../common/CommonStyle';
import { SORT_BOT_OPTIONS, PER_PAGE } from '../../constants/Constants';
import PopupHandleGC from '../common/PopupHandleGC';
import checkBoxUnChecked from '../../../assets/imgs/check_box_uncheck.png';
import checkBoxChecked from '../../../assets/imgs/check_box_checked.png';
import StyleNumber from '../StyleNumber';
import { MAX_GC_CHARGE_ERROR } from '../../constants/Charge';

class ChargeListBot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chargeIds: [],
      botSelectedName: '',
      idsSelected: [],
      isOpenModalCharge: false,
    };
    this.handleSortBots = this.handleSortBots.bind(this);
    this.handleChargeGc = this.handleChargeGc.bind(this);
    this.selectMultiCheckBox = this.selectMultiCheckBox.bind(this);
    this.selectAllCheckBox = this.selectAllCheckBox.bind(this);
    this.unSelectAllCheckBox = this.unSelectAllCheckBox.bind(this);
    this.openModalCharge = this.openModalCharge.bind(this);
    this.closeModalCharge = this.closeModalCharge.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
  }

  onChangePage(page) {
    this.props.onChangePage(page);
    this.setState({ idsSelected: [] });
  }

  openModalCharge(id, name) {
    this.setState({
      isOpenModalCharge: true,
      chargeIds: id,
      botSelectedName: name,
    });
  }

  handleSortBots(optionId, option) {
    this.props.sortBot(option.value);
  }

  closeModalCharge() {
    this.setState({
      isOpenModalCharge: false,
    });
  }

  selectMultiCheckBox(id) {
    const { idsSelected } = this.state;
    const arrayId = [...idsSelected];
    if (arrayId.indexOf(id) === -1) {
      arrayId.push(id);
    } else {
      arrayId.splice(arrayId.indexOf(id), 1);
    }
    this.setState({
      idsSelected: arrayId,
    });
  }

  selectAllCheckBox(listBotOff) {
    const { idsSelected } = this.state;
    const arrayId = [...idsSelected];
    listBotOff.map((item) => {
      if (arrayId.indexOf(item.id) === -1) {
        arrayId.push(item.id);
      }
      return true;
    });
    this.setState({
      idsSelected: arrayId,
    });
  }

  unSelectAllCheckBox() {
    this.setState({
      idsSelected: [],
    });
  }

  handleChargeGc(isHandleAll, amount, onSuccess, onError) {
    const { gift } = this.props;
    const { chargeIds } = this.state;
    gift(chargeIds, amount, onSuccess, onError);
  }

  renderModalCharge() {
    const { botSelectedName, chargeIds } = this.state;
    const { lucUserGC, fetchListBots } = this.props;
    return (
      <PopupHandleGC
        botName={botSelectedName}
        isOpen={this.state.isOpenModalCharge}
        onClose={this.closeModalCharge}
        onSubmit={this.handleChargeGc}
        fetchBotData={fetchListBots}
        totalGC={lucUserGC}
        maxValue={MAX_GC_CHARGE_ERROR}
        messageConfirm={i18n.t('chargeGcBots')}
        label={i18n.t('charge')}
        title={i18n.t('chargeMultiBotNotification', { amount: Object.keys(chargeIds).length })}
        totalLabel={i18n.t('chargeAvailable')}
        allGcTitle={i18n.t('chargeAllInput')}
        amountGcTitle={i18n.t('placeholderChargeGC')}
        submitTitle={i18n.t('charge')}
      />
    );
  }

  renderListBot(listBotOff) {
    const { listBot } = this.props;
    const { idsSelected } = this.state;
    return (
      <React.Fragment>
        {
          listBot.map(item => (
            <WrapperBot key={item.id} backgroundColor={item.remain_time > 0 && '#f4dbdb4f'}>
              <div>
                <Label>
                  <WrapperStatus>
                    {item.status === 1 ? (
                      <ButtonStatus isOn>{i18n.t('on')}</ButtonStatus>
                    ) : (
                        <ButtonStatus>{i18n.t('off')}</ButtonStatus>
                      )}
                    <span>{item.name}</span>
                  </WrapperStatus>
                </Label>
                <WrapperSpan> GC : {<StyleNumber value={item.GC} afterDot={2} color={item.GC < 0 ? '#ff5a5a' : '#fff'} />} </WrapperSpan>
              </div>
              {(item.status === 0) && (item.remain_time <= 0) && (
                <Label>
                  {Object.keys(listBotOff).length > 1
                    && (
                      <CheckBox
                        onClick={() => this.selectMultiCheckBox(item.id)}
                        value={item.id}
                        src={idsSelected.indexOf(item.id) !== -1
                          ? checkBoxChecked : checkBoxUnChecked}
                      />
                    )
                  }
                  <ChargeButton onClick={() => this.openModalCharge([item.id], item.name)}>{i18n.t('depositButton')}</ChargeButton>
                </Label>
              )}
            </WrapperBot>
          ))
        }
        <Footer />
      </React.Fragment>
    );
  }

  render() {
    const { idsSelected, isOpenModalCharge } = this.state;
    const {
      listBot, total, currentPage, isMobile,
    } = this.props;
    const canBatchCharge = Object.keys(idsSelected).length !== 0;
    const listBotOff = listBot.filter(item => item.status === 0 && item.remain_time === 0);
    return (
      <React.Fragment>
        <WrapperTitleCharge flexDirection={isMobile ? 'column' : 'row'}>
          <WrapperNotification>
            {i18n.t('chargeNoti')}
          </WrapperNotification>
          <DropDown
            data={SORT_BOT_OPTIONS}
            onChangeSelected={this.handleSortBots}
          />
        </WrapperTitleCharge>
        <WrapperTitleCharge flexDirection={isMobile ? 'column' : 'row'}>
          {i18n.t('depositMessage')}
          {Object.keys(listBotOff).length > 1
            && (
              <InlineDiv>
                <ChargeButton
                  isDisabled={!canBatchCharge}
                  onClick={canBatchCharge && (() => this.openModalCharge(idsSelected))}
                >{i18n.t('batchCharge')}
                </ChargeButton>
                {
                  Object.keys(idsSelected).length === Object.keys(listBotOff).length
                    ? (
                      <Label alignSelf="center">
                        <ChargeButton onClick={this.unSelectAllCheckBox}>
                          {i18n.t('unSelectAll')}
                        </ChargeButton>
                      </Label>
                    )
                    : (
                      <Label alignSelf="center">
                        <ChargeButton onClick={() => this.selectAllCheckBox(listBotOff)}>
                          {i18n.t('selectAll')}
                        </ChargeButton>
                      </Label>
                    )
                }
              </InlineDiv>
            )
          }
        </WrapperTitleCharge>
        {this.renderListBot(listBotOff)}
        {isOpenModalCharge && this.renderModalCharge()}
        {total / PER_PAGE > 1
          ? (
            <WrapperPaginationCustom>
              <Pagination
                current={currentPage}
                pageSize={PER_PAGE}
                total={total}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '1em',
                }}
                onChange={(page) => { this.onChangePage(page); }}
              />
            </WrapperPaginationCustom>
          )
          : null}
      </React.Fragment>
    );
  }
}

ChargeListBot.defaultProps = {
  total: 0,
  currentPage: 0,
};

ChargeListBot.propTypes = {
  lucUserGC: PropsType.number.isRequired,
  listBot: PropsType.array.isRequired,
  sortBot: PropsType.func.isRequired,
  fetchListBots: PropsType.func.isRequired,
  total: PropsType.number,
  currentPage: PropsType.number,
  onChangePage: PropsType.func.isRequired,
  isMobile: PropsType.bool.isRequired,
  gift: PropsType.func.isRequired,
};

export default ChargeListBot;
