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
  font-weight: ${props => (props.fontWeight ? props.fontWeight : 900)};
  display: flex;
  color: ${props => (props.isDisable ? '#ccc' : '#fff')};
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

class PopupHandleGC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: '',
      isLoading: false,
      isValidGC: false,
      isHandleAll: true,
    };

    this.handleChangeState = this.handleChangeState.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeMethod = this.handleChangeMethod.bind(this);
    this.onChangeValue = this.onChangeValue.bind(this);
    this.onFocusValue = this.onFocusValue.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
  }

  onSuccess(data) {
    const { onClose, fetchBotData } = this.props;
    this.setState({ isLoading: false });
    ApiErrorUtils.handleServerError(
      data,
      Alert.instance,
      () => {
        fetchBotData();
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

  onChangeValue(event) {
    const { maxValue } = this.props;
    const { amount } = this.state;
    let { value } = event.target;
    if (amount === '0' && value !== '0.0' && value !== '') {
      value = Number(value);
    }
    value = convertNumber(value);
    if ((value === '')
      || (value < 1)
      || (value > maxValue)
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

  onFocusValue() {
    const { maxValue } = this.props;
    const { amount } = this.state;
    if ((amount > maxValue)
      || (amount <= 0)
      || (amount === '')) {
      this.setState({ isValidGC: false });
    }
    this.setState({ isHandleAll: false });
  }

  handleChangeMethod(value) {
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
    this.setState({ isHandleAll: value });
  }

  handleChangeState(value, fieldName) {
    this.setState({ [fieldName]: value });
  }

  handleSubmit() {
    const { messageConfirm, onSubmit, totalGC } = this.props;
    const { isHandleAll, amount } = this.state;
    Alert.instance.showAlertConfirmAction(
      messageConfirm,
      [
        () => Alert.instance.hideAlert(),
        () => {
          Alert.instance.hideAlert();
          this.setState({ isLoading: true });
          onSubmit(isHandleAll, isHandleAll ? totalGC : amount, this.onSuccess, this.onError);
        },
      ],
    );
  }

  renderError() {
    const { maxValue, totalGC, isChargePopup } = this.props;
    const { isHandleAll, isValidGC } = this.state;
    if (maxValue < totalGC && isHandleAll) {
      return (<ErrorText>{i18n.t('chargeAmountMax')}</ErrorText>);
    }
    if (!isHandleAll && !isValidGC) {
      return (
        <ErrorText>{i18n.t('ChargeGCErrorInput', { minGC: 1, maxGC: maxValue.toLocaleString('ja') })}</ErrorText>
      );
    }
    if (totalGC < 1) {
      if (isChargePopup) {
        return (
          <ErrorText>{i18n.t('gcLucLessThan1')}</ErrorText>
        );
      }
      return (
        <ErrorText>{i18n.t('gcLessThan1')}</ErrorText>
      );
    }
    return '';
  }

  renderButtons() {
    const { isValidGC, isHandleAll } = this.state;
    const {
      onClose, submitTitle,
      totalGC, maxValue, isChargePopup,
    } = this.props;
    const isDisable = isHandleAll ? totalGC > maxValue : !isValidGC;

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
              onClick={this.handleSubmit}
              disable={isDisable || totalGC <= 0 || (isChargePopup && totalGC < 1)}
            >
              {submitTitle}
            </ButtonDisable>
          </ButtonConfirm>
        </ActionPopup>
      </React.Fragment>
    );
  }

  render() {
    const {
      onClose, label,
      title, totalLabel,
      amountGcTitle, totalGC, isChargePopup,
      allGcTitle,
    } = this.props;
    const {
      isLoading, amount,
      isHandleAll,
    } = this.state;
    const width = isMobile ? '36em' : '60%';
    const isDisable = totalGC < 1;
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
          <Content padding="0 1em 1em">
            <Title fontSize={2}>{label}</Title>
            <MessageContent
              marginTop={1}
              whiteSpace={!isMobile && 'pre-line'}
              fontSize={1}
              fontWeight="lighter"
            >
              {title}
            </MessageContent>
            <MessageContent
              fontSize={1.2}
              marginTop={2}
            >
              {totalLabel}
              <StyleNumber value={totalGC} afterDot={2} />
              {' GC'}
            </MessageContent>
            <ContentPopup fontSize={isMobile && 0.8}>
              <ContentItem>
                <RadioButton
                  isChecked={isChargePopup && isDisable ? false : isHandleAll}
                  onChange={() => this.handleChangeMethod(true)}
                  isDisable={isChargePopup && isDisable}
                />
                <MessageContent
                  isDisable={isDisable && isChargePopup}
                  marginLeft={1}
                  onClick={isChargePopup && isDisable ? null : () => this.handleChangeMethod(true)}
                >
                  {allGcTitle}
                </MessageContent>
              </ContentItem>
              <ContentItem marginTop={2}>
                <RadioButton
                  isChecked={!isHandleAll}
                  onChange={() => this.handleChangeMethod(false)}
                  isDisable={isDisable}
                />
                <MessageContent
                  isDisable={isDisable}
                  marginLeft={1}
                  onClick={isDisable ? null : () => this.handleChangeMethod(false)}
                >
                  {amountGcTitle}
                </MessageContent>
                <InputStyle
                  type="number"
                  step=".01"
                  onChange={event => this.onChangeValue(event)}
                  onFocus={this.onFocusValue}
                  value={amount.toString()}
                  disabled={isDisable}
                />
              </ContentItem>
              {this.renderError()}
            </ContentPopup>
          </Content>
          {this.renderButtons()}
        </AlertStyled>
        <Spinner isLoading={isLoading} />
      </WrapperOnBot>
    );
  }
}

PopupHandleGC.propTypes = {
  onClose: PropTypes.func.isRequired,
  messageConfirm: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  fetchBotData: PropTypes.func.isRequired,
  maxValue: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  totalLabel: PropTypes.string.isRequired,
  amountGcTitle: PropTypes.string.isRequired,
  totalGC: PropTypes.number.isRequired,
  allGcTitle: PropTypes.string.isRequired,
  submitTitle: PropTypes.string.isRequired,
  isChargePopup: PropTypes.bool,
};

PopupHandleGC.defaultProps = {
  isChargePopup: true,
};

export default PopupHandleGC;
