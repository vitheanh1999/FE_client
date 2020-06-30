import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import iconX from '../../../assets/imgs/icon_x.png';
import i18n from '../../i18n/i18n';
import RadioButton from './RadioButton';
import {
  Wrapper, AlertStyled, CloseButton,
  Content, Message, Title,
} from './Alert/alertStyle';
import { ButtonDisable } from '../mainContainer/mainStyle';
import Alert from './Alert/Alert';
import Spinner from './Spinner';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import { convertNumber } from '../../helpers/utils';
import StyleNumber from '../StyleNumber';

const InputStyle = styled.input`
  height: 2.38em;
  border-radius: 0.278em;
  margin: 0 0 0 0.5em;
  padding: 0.5em;
  border: 1px solid gray;
`;

const ErrorText = styled.span`
  color: red;
  position: absolute;
  font-size: 0.8em;
`;

const ButtonConfirm = styled.div`
  display: flex;
`;

const WrapperOnBot = styled(Wrapper)`
  z-index: 1;
`;

const MessageContent = styled(Message)`
  margin-left: ${props => props.marginLeft}em;
  margin-top: ${props => props.marginTop}em;
  font-weight: 900;
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

class PopupPayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      bot: {},
      isLoading: false,
      isValidGC: false,
      isPayoutAll: true,
    };

    this.handleChangeState = this.handleChangeState.bind(this);
    this.handlePayout = this.handlePayout.bind(this);
    this.handleChangePayoutMethod = this.handleChangePayoutMethod.bind(this);
    this.onChangeValuePayout = this.onChangeValuePayout.bind(this);
    this.onFocusValuePayout = this.onFocusValuePayout.bind(this);
    this.onSuccessPayOut = this.onSuccessPayOut.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    const { bot } = this.props;
    this.setState({ bot });
  }

  onSuccessPayOut(data) {
    const { onClose, bot, fetchBotDetail } = this.props;
    this.setState({ isLoading: false });
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => {
        fetchBotDetail(bot.id, () => { }, () => { });
        onClose();
        Alert.instance.showAlert(i18n.t('success'), data.message);
      },
    );
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

  onChangeValuePayout(event) {
    const { bot } = this.props;
    const { amount } = this.state;
    let { value } = event.target;
    if (amount === '0' && value !== '0.0' && value !== '') {
      value = Number(value);
    }
    value = convertNumber(value);
    if ((value === '')
      || (value <= 0)
      || (value > bot.GC)
    ) {
      this.setState({
        isValidGC: false,
        amount: value,
      });
    } else {
      this.setState({
        amount: value,
        isValidGC: true,
      });
    }
  }

  onFocusValuePayout() {
    const { bot } = this.props;
    const { amount } = this.state;
    if ((amount > bot.gc)
      || (amount <= 0)
      || (amount === '')) {
      this.setState({ isValidGC: false });
    }
    this.setState({ isPayoutAll: false });
  }

  handleChangePayoutMethod(value) {
    if (value) {
      this.setState({
        amount: '',
        isValidGC: true,
      });
    } else {
      this.setState({
        amount: '',
        isValidGC: false,
      });
    }
    this.setState({ isPayoutAll: value });
  }

  handleChangeState(value, fieldName) {
    this.setState({ [fieldName]: value });
  }

  handlePayout() {
    Alert.instance.showAlertConfirmAction(
      i18n.t('askPayout'),
      [
        () => Alert.instance.hideAlert(),
        () => {
          Alert.instance.hideAlert();
          this.setState({ isLoading: true });
          const { bot, payout } = this.props;
          const { amount, isPayoutAll } = this.state;
          let params = { botId: bot.id };
          if (!isPayoutAll) {
            params = { ...params, amount: Number(amount).toFixed(2) };
          }
          payout(params, this.onSuccessPayOut, this.onError);
        },
      ],
    );
  }

  renderButtons() {
    const { isValidGC, isPayoutAll } = this.state;
    const { onClose } = this.props;

    return (
      <React.Fragment>
        <ActionPopup>
          <ButtonConfirm>
            <ButtonDisable
              fontSize="1.1em"
              hoverBgColor="#20bcdf"
              color="#2d889c"
              padding="0 1em 0 1em"
              onClick={() => onClose()}
              height="3em"
              width="8em"
            >
              {i18n.t('cancelAction')}
            </ButtonDisable>
            <ButtonDisable
              fontSize="1.1em"
              hoverBgColor="#20bcdf"
              color="#23B083"
              margin=" 0 0 0 2em"
              padding="0 1em 0 1em"
              height="3em"
              width="8em"
              onClick={this.handlePayout}
              disable={!isValidGC && !isPayoutAll}
            >
              {i18n.t('payout')}
            </ButtonDisable>
          </ButtonConfirm>
        </ActionPopup>
      </React.Fragment>
    );
  }

  render() {
    const { onClose } = this.props;
    const {
      isLoading, bot, amount,
      isPayoutAll, isValidGC,
    } = this.state;
    if (!bot) return null;
    const botGc = bot.GC || 0;
    const width = isMobile ? '36em' : '70%';
    return (
      <WrapperOnBot className="alertClass">
        <AlertStyled
          width={width}
          maxWidth="90%"
          id="Alert"
        >
          <CloseButton
            src={iconX}
            onClick={() => onClose()}
          />
          <Content padding={1}>
            <Title fontSize={2}>{i18n.t('warning')}</Title>
            <MessageContent
              marginTop={1}
              whiteSpace={!isMobile && 'pre-line'}
              fontSize={1.2}
              fontWeight={600}
            >
              {i18n.t('payoutTitle')}
            </MessageContent>
            <MessageContent marginTop={3} style={{ display: 'flex' }}>
              {i18n.t('totalNumberGC')}
              <StyleNumber value={botGc} afterDot={2} />
              {' GC'}
            </MessageContent>
            <ContentPopup fontSize={isMobile && 0.8}>
              <ContentItem>
                <RadioButton
                  isChecked={isPayoutAll}
                  onChange={() => this.handleChangePayoutMethod(true)}
                />
                <MessageContent marginLeft={1} onClick={() => this.handleChangePayoutMethod(true)}>
                  {i18n.t('allGc')}
                </MessageContent>
              </ContentItem>
              <ContentItem marginTop={2}>
                <RadioButton
                  isChecked={!isPayoutAll}
                  onChange={() => this.handleChangePayoutMethod(false)}
                />
                <MessageContent marginLeft={1} onClick={() => this.handleChangePayoutMethod(false)}>
                  {i18n.t('amountGc')}
                </MessageContent>
                <InputStyle
                  type="number"
                  step=".01"
                  onChange={event => this.onChangeValuePayout(event)}
                  onFocus={this.onFocusValuePayout}
                  value={amount.toString()}
                />
              </ContentItem>
              {!isPayoutAll && !isValidGC && (<ErrorText>{i18n.t('ChargeGCErrorInput', { minGC: 0, maxGC: botGc.toLocaleString('ja') })}</ErrorText>)}
            </ContentPopup>
          </Content>
          {this.renderButtons()}
        </AlertStyled>
        <Spinner isLoading={isLoading} />
      </WrapperOnBot>
    );
  }
}

PopupPayout.propTypes = {
  onClose: PropTypes.func.isRequired,
  payout: PropTypes.func.isRequired,
  bot: PropTypes.object.isRequired,
  fetchBotDetail: PropTypes.func.isRequired,
};

export default PopupPayout;
