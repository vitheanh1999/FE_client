import React, { Component, Fragment } from 'react';
import PropsType from 'prop-types';
import styled from 'styled-components';
import Alert from '../common/Alert/Alert';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import images from '../../theme/images';
import i18n from '../../i18n/i18n';
import InputText from '../common/InputText';
import Dropdown from '../common/Dropdown/Dropdown';
import Spinner from '../common/Spinner';
import {
  ModalFooter, ModalBodyCustom, ModalCustom,
  ModalHeaderCustom, Hr, ButtonAdd,
  BodyContentPopup, ButtonDisable,
} from '../mainContainer/mainStyle';
import { Button, RemoveFormButton } from './listBotsStyle';
import { convertCampaignOption } from '../../helpers/utils';

const WrapperAddMore = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 30%;
  align-items: center;
`;

const onSuccessFetchListCampaign = (data) => {
  ApiErrorUtils.handleServerError(data, Alert.instance, () => { });
};

class AddBot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      botInfos: [
        {
          name: '',
          campaign_id: '',
          isError: false,
          errorMessage: '',
        },
      ],
      isShowPopup: false,
      isLoading: false,
    };

    this.closeModal = this.closeModal.bind(this);
    this.addBodyAddBot = this.addBodyAddBot.bind(this);
    this.handleChangeBotName = this.handleChangeBotName.bind(this);
    this.handleChangeCampaign = this.handleChangeCampaign.bind(this);
    this.onSuccessAddBots = this.onSuccessAddBots.bind(this);
    // this.onSuccessFetchListCampaign = this.onSuccessFetchListCampaign.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    this.fetchListCampaigns();
  }

  onSuccessAddBots(data) {
    ApiErrorUtils.handleServerError(data, Alert.instance, () => {
      setTimeout(() => {
        this.closeModal();
        this.setState({ isLoading: false });
        this.props.fetchListBots();
      }, 500);
    }, () => this.setState({ isLoading: false }));
  }

  onError(error) {
    try {
      ApiErrorUtils.handleHttpError(error, Alert.instance);
    } catch (err) {
      // do something
    } finally {
      this.setState({ isLoading: false });
    }
  }

  onClickAddBot() {
    const { createBots } = this.props;
    const { botInfos } = this.state;
    if (this.validateBotInfos()) {
      const params = botInfos;
      this.setState({ isLoading: true });
      createBots(this.onSuccessAddBots, this.onError, params);
    }
  }

  closeModal() {
    this.setState({
      isShowPopup: false,
      botInfos: [
        {
          name: '',
          campaign_id: '',
          isError: false,
          isErrorMessage: '',
        },
      ],
    });
  }

  showModal() {
    const { isAddBot, maxBot } = this.props;
    const alert = Alert.instance;
    if (!isAddBot) {
      alert.showAlert(i18n.t('error'), i18n.t('botLimited', { maxBot }), i18n.t('OK'), () => alert.hideAlert());
    } else {
      this.fetchListCampaigns();
      this.setState({
        isShowPopup: true,
      });
    }
  }

  addBodyAddBot() {
    const { botInfos } = this.state;
    if (botInfos.length < 5) {
      botInfos.push({ name: '' });
      this.setState({ botInfos });
    }
  }

  removeFormAddBot(index) {
    const { botInfos } = this.state;
    botInfos.splice(index, 1);
    this.setState({ botInfos });
  }

  handleChangeBotName(value, indexBot) {
    const { botInfos } = this.state;
    let nameIsExist = false;
    botInfos.forEach((botInfo, index) => {
      if (value === botInfo.name && index !== indexBot) {
        if (!nameIsExist) nameIsExist = true;
      }
    });
    if (nameIsExist) {
      botInfos[indexBot].errorMessage = i18n.t('theNameIsExist');
    }
    botInfos[indexBot] = { ...botInfos[indexBot], name: value, isError: nameIsExist };
    this.setState({ botInfos });
  }

  handleChangeCampaign(infoId, infos, index) {
    const { botInfos } = this.state;
    botInfos[index].campaign_id = infos.value;
    this.setState({ botInfos });
  }

  validateBotInfos() {
    const { botInfos } = this.state;
    let isValidate = true;
    botInfos.forEach((botInfo) => {
      if (!botInfo.name || botInfo.isError) {
        botInfo.errorMessage = botInfo.isError ? botInfo.errorMessage : i18n.t('txtFieldMinSize');
        botInfo.isError = true;
        if (isValidate) isValidate = false;
      }
    });
    this.setState({ botInfos });
    return isValidate;
  }

  fetchListCampaigns() {
    const { fetchListCampaigns } = this.props;
    fetchListCampaigns(onSuccessFetchListCampaign, this.onError, null);
  }

  renderBodyAddBot(item, index) {
    const { listCampaigns } = this.props;
    const { botInfos } = this.state;
    const campaignData = convertCampaignOption(listCampaigns, 342);
    return (
      <BodyContentPopup key={index}>
        {
          index ? (
            <RemoveFormButton>
              <ButtonAdd
                width="1.5em"
                height="1em"
                margin="0 0 0.5em 0"
                bgrImage={images.minus}
                hoverBgColor="#23B083"
                onClick={() => this.removeFormAddBot(index)}
              />
            </RemoveFormButton>
          ) : ''
        }
        <InputText
          title={i18n.t('botName')}
          value={item.bot_name}
          index={index}
          isError={botInfos[index].isError}
          errorMessage={botInfos[index].errorMessage}
          size={20}
          minSize={1}
          height="2em"
          width={campaignData.maxLength}
          handleChangeInput={this.handleChangeBotName}
          isFlexColumn
        />
        <Dropdown
          index={index}
          data={campaignData.campaignOption}
          title={i18n.t('campaign')}
          heightOptions={10}
          width={campaignData.maxLength}
          onChangeSelected={this.handleChangeCampaign}
          isFlexColumn
        />
        <Hr />
      </BodyContentPopup>
    );
  }

  renderPopupAddBot() {
    const { isShowPopup, botInfos } = this.state;
    const { fontSize } = this.props;
    const bodyAddBot = botInfos.map((item, index) => this.renderBodyAddBot(item, index));
    return (
      <ModalCustom
        centered
        isOpen={isShowPopup}
        // toggle={this.closeModal}
        fontSize={fontSize * 0.9}
      >
        <ModalHeaderCustom toggle={this.closeModal}>{i18n.t('addBot')}</ModalHeaderCustom>
        <ModalBodyCustom>
          {bodyAddBot}
          <ModalFooter>
            {
              // <WrapperAddMore>
              //   <ButtonAdd
              //     width="2em"
              //     height="2em"
              //     borderRadius="50%"
              //     bgrImage={images.add}
              //     color="#2db7f5"
              //     hoverBgColor="#23B083"
              //     onClick={this.addBodyAddBot}
              //   />
              //   <div>{i18n.t('addMore')}</div>
              // </WrapperAddMore>
            }
            <ButtonDisable
              hoverBgColor="#23B083"
              width="9em"
              height="2.75em"
              color="#2d889c"
              onClick={() => this.onClickAddBot()}
            >
              {i18n.t('addBot')}
            </ButtonDisable>
          </ModalFooter>
        </ModalBodyCustom>
      </ModalCustom>
    );
  }

  render() {
    const { isShowPopup } = this.state;
    return (
      <Fragment>
        <Button
          padding="1em"
          hoverBgColor="#20bcdf"
          onClick={() => this.showModal()}
        >
          <React.Fragment>
            <img
              src={images.add}
              alt="view mode"
              id="view-mode-btn"
            />
            {i18n.t('addBot')}
          </React.Fragment>
        </Button>
        {isShowPopup ? this.renderPopupAddBot() : ''}
        <Spinner isLoading={this.state.isLoading} />
      </Fragment>
    );
  }
}

AddBot.propTypes = {
  createBots: PropsType.func.isRequired,
  fontSize: PropsType.number.isRequired,
  fetchListBots: PropsType.func.isRequired,
  fetchListCampaigns: PropsType.func.isRequired,
  listCampaigns: PropsType.any.isRequired,
  isAddBot: PropsType.bool.isRequired,
  maxBot: PropsType.number.isRequired,
};
export default AddBot;
