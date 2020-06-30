import React, { Component } from 'react';
import PropsType from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Button, TitleHead,
  ModalFooter,
  ErrorText,
  ModalBodyCustom,
  ModalCustom,
  ModalHeaderCustom,
  WrapperContentCharge,
  TextCustom, Span, Img,
} from './ChargeStyle';
import i18n from '../../i18n/i18n';
import {
  MAX_GC_CHARGE, MIN_GC_CHARGE, MAX_GC_CHARGE_ERROR, MIN_GC_CHARGE_ERROR,
} from '../../constants/Charge';
import { fontSize, WrapperSpan } from '../common/CommonStyle';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import Alert from '../common/Alert/Alert';
import * as DepositActions from '../../actions/Deposit';
import Spinner from '../common/Spinner';
import StyleInput from '../common/InputFloat';
import { images } from '../../theme';
import StyleNumber from '../StyleNumber';

export const convertNumber = (value) => {
  let number = value * 100;
  number = Math.floor(number);
  return number / 100;
};

class ChargeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gc: '',
      isErrorGCValue: false,
      canCharge: false,
      isLoading: false,
      isChargeMaxGC: false,
    };
    this.onChangeValueCharge = this.onChangeValueCharge.bind(this);
    this.onBlurValueCharge = this.onBlurValueCharge.bind(this);
    this.chargeAction = this.chargeAction.bind(this);
    this.onSuccessCharge = this.onSuccessCharge.bind(this);
    this.onError = this.onError.bind(this);
    this.closeModalCharge = this.closeModalCharge.bind(this);
    this.onHandleInputAllGC = this.onHandleInputAllGC.bind(this);
  }

  componentDidMount() {
    // this.setState({ gc: initGC });
  }

  onChangeValueCharge(value) {
    this.setState({
      isErrorGCValue: false,
      canCharge: true,
      gc: value,
      isChargeMaxGC: false,
    });
  }

  onHandleInputAllGC() {
    let gcValue = this.props.lucUserGC;
    let { isChargeMaxGC } = this.state;
    if (this.props.lucUserGC > MAX_GC_CHARGE_ERROR) {
      gcValue = MAX_GC_CHARGE_ERROR;
      isChargeMaxGC = true;
    }
    this.setState({
      gc: gcValue.toString(),
      canCharge: true,
      isChargeMaxGC,
    }, () => this.onBlurValueCharge());
  }

  onBlurValueCharge() {
    const { gc } = this.state;
    if ((gc > MAX_GC_CHARGE_ERROR)
      || (gc < MIN_GC_CHARGE_ERROR)
      || (gc === '')) {
      this.setState({
        isErrorGCValue: true,
        canCharge: false,
      });
    } else {
      this.setState({
        isErrorGCValue: false,
        canCharge: true,
      });
    }
  }

  onSuccessCharge(data) {
    const { fetchListBots } = this.props;
    this.closeModalCharge();
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => {
        Alert.instance.showAlert(i18n.t('success'), data.message);
      },
    );
    this.setState({ isLoading: false });
    fetchListBots();
  }

  onError(error) {
    this.closeModalCharge();
    ApiErrorUtils.handleHttpError(error, Alert.instance);
    this.setState({ isLoading: false });
  }

  closeModalCharge() {
    const { closeModalCharge } = this.props;
    closeModalCharge();
    this.setState({ gc: 0, isErrorGCValue: false });
  }

  chargeAction() {
    const { chargeIds, actions } = this.props;
    const { chargeAction } = actions;
    const { gc } = this.state;
    const gcAmount = Number(gc);
    Alert.instance.showAlertTwoButtons(
      i18n.t('warning'),
      Object.keys(chargeIds).length <= 1 ? i18n.t('chargeGcBot') : i18n.t('chargeGcBots'),
      [i18n.t('cancel'), i18n.t('OK')],
      [
        () => Alert.instance.hideAlert(),
        () => {
          this.setState({ isLoading: true });
          chargeAction(chargeIds, gcAmount, this.onSuccessCharge, this.onError);
          Alert.instance.hideAlert();
        },
      ],
      Alert.instance.hideAlert(),
    );
  }

  render() {
    const {
      gc, isErrorGCValue, canCharge, isLoading, isChargeMaxGC,
    } = this.state;
    const {
      chargeIds, isOpen, lucUserGC,
    } = this.props;

    return (
      <ModalCustom
        centered
        isOpen={isOpen}
        fontSize={fontSize}
      >
        <ModalHeaderCustom toggle={this.closeModalCharge}>
          <TitleHead>{i18n.t('charge')}</TitleHead>
        </ModalHeaderCustom>
        <ModalBodyCustom>
          {
            Object.keys(chargeIds).length <= 1
              ? (<span>{i18n.t('charge1BotNotification')}</span>)
              : (
                <span>{i18n.t('chargeMultiBotNotification', { amount: Object.keys(chargeIds).length })}</span>
              )
          }
          <WrapperContentCharge>
            <Span>
              <WrapperSpan>{<StyleNumber value={lucUserGC} color="#fff" afterDot={2} />}{i18n.t('gc')}</WrapperSpan>
              <TextCustom margin="0px 5px" fontSize="14px">({i18n.t('chargeAvailable')})</TextCustom>
              <Button backgroundColor="#1289C4" height="auto" onClick={this.onHandleInputAllGC}>
                <Img src={images.edit3} alt="" fontSize="10px" />
                <TextCustom margin="0px 5px" fontSize="13px" fontWeight="600">{i18n.t('chargeAllInput')}</TextCustom>
              </Button>
            </Span>
          </WrapperContentCharge>
          <StyleInput
            value={gc || ''}
            onChange={t => this.onChangeValueCharge(t)}
            onBlur={() => this.onBlurValueCharge()}
            width={24}
            height={2.38}
            minValue={MIN_GC_CHARGE}
            maxValue={MAX_GC_CHARGE}
            placeholder={i18n.t('placeholderChargeGC')}
            enableEqualMin
          />
          {isChargeMaxGC && <ErrorText>{i18n.t('chargeAmountMax')}</ErrorText>}
          {isErrorGCValue ? (<ErrorText>{i18n.t('ChargeGCError')}</ErrorText>) : <span />}
          <ModalFooter>
            <Button backgroundColor="#1289C4" width="7.5em" height="2.75em" onClick={this.closeModalCharge}>{i18n.t('cancel')}</Button>
            {canCharge
              ? (
                <Button
                  backgroundColor="#23B083"
                  width="7.5em"
                  height="2.75em"
                  onClick={() => { this.chargeAction(); }}
                >
                  {i18n.t('charge')}
                </Button>
              )
              : (<Button backgroundColor="#ccc" isDisabled width="7.5em" height="2.75em">{i18n.t('charge')}</Button>)
            }
          </ModalFooter>
        </ModalBodyCustom>
        <Spinner isLoading={isLoading} />
      </ModalCustom>
    );
  }
}

ChargeModal.defaultProps = {
  chargeIds: [],
  fetchListBots: () => { },
};

ChargeModal.propTypes = {
  chargeIds: PropsType.array,
  lucUserGC: PropsType.number.isRequired,
  isOpen: PropsType.bool.isRequired,
  closeModalCharge: PropsType.func.isRequired,
  actions: PropsType.object.isRequired,
  fetchListBots: PropsType.func,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  actions: {
    chargeAction: bindActionCreators(DepositActions.gift, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChargeModal);
