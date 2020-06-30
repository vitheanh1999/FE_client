import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ButtonAdd, Message, WrapperInput } from '../mainContainer/mainStyle';
import i18n from '../../i18n/i18n';
import { images } from '../../theme';
import Dropdown from '../common/Dropdown/Dropdown';
import { Name } from './BotDetailStyle';
import Alert from '../common/Alert/Alert';
import ApiErrorUtils from '../../helpers/ApiErrorUtils';
import { convertCampaignOption } from '../../helpers/utils';

export const FLAG = {
  CAN_PAYOUT: 0,
  CANNOT_PAYOUT: 1,
};

class ChangeBotCampaign extends Component {
  constructor(props) {
    super(props);

    const { campaignBot } = this.props;
    this.state = {
      isShowDropdown: false,
      campaignSelect: { ...campaignBot },
    };

    this.handleChangeCampaign = this.handleChangeCampaign.bind(this);
    this.handleSubmitCampaign = this.handleSubmitCampaign.bind(this);
    this.onError = this.onError.bind(this);
  }

  onError(error) {
    try {
      ApiErrorUtils.handleHttpError(error, Alert.instance);
    } catch (err) {
      // do something
    } finally {
      this.setState({ isShowDropdown: false });
    }
  }

  openDropdown() {
    this.setState({ isShowDropdown: true });
    this.props.handleChangeProps(true, 'isChangeCampaign');
  }

  handleChangeCampaign(id, campaign) {
    const { handleChangeProps, isError } = this.props;
    if (isError) {
      handleChangeProps(true, 'isValidCampaign');
      this.openDropdown();
    }
    this.setState({ campaignSelect: { _id: campaign.value, name: campaign.text } });
  }

  handleSubmitCampaign() {
    const { updateBotCampaign, campaignBot, handleChangeProps } = this.props;
    const { campaignSelect } = this.state;
    handleChangeProps(false, 'isChangeCampaign');
    if (campaignSelect && campaignSelect._id && campaignBot._id !== campaignSelect._id) {
      Alert.instance.showAlertConfirmAction(
        i18n.t('updateBotCampaign'),
        [
          () => {
            Alert.instance.hideAlert();
            this.setState({ campaignSelect: campaignBot, isShowDropdown: false });
          },
          () => {
            Alert.instance.hideAlert();
            updateBotCampaign(campaignSelect._id);
            this.setState({ isShowDropdown: false });
          },
        ],
        () => {
          Alert.instance.hideAlert();
          this.setState({ campaignSelect: campaignBot, isShowDropdown: false });
        },
      );
    } else {
      this.setState({ isShowDropdown: false });
    }
    handleChangeProps(true, 'isValidCampaign');
  }

  renderCampaignName() {
    const { isChangeBotCampaign, campaignBot } = this.props;
    return (
      <Fragment>
        <span>{campaignBot && campaignBot.name}</span>
        {isChangeBotCampaign ? (
          <ButtonAdd
            fontSize="1em"
            hoverBgColor="#2d889c"
            height="2em"
            width="2em"
            margin="0 0 0 0.5em"
            bgrImage={images.editWhite}
            onClick={() => this.openDropdown()}
          />
        ) : ''
        }
      </Fragment>
    );
  }

  renderDropdownCampaign() {
    const { listCampaigns, campaignBot, isError } = this.props;
    const { isShowDropdown } = this.state;
    const campaignData = convertCampaignOption(listCampaigns, 162);
    return (
      <div>
        <WrapperInput>
          <Dropdown
            data={campaignData.campaignOption}
            onChangeSelected={this.handleChangeCampaign}
            defaultSelectedId={campaignBot && campaignBot._id}
            heightOptions={10}
            width={campaignData.maxLength}
          />
          <ButtonAdd
            fontSize="1em"
            hoverBgColor="#23B083"
            opacity="0.5"
            height="2em"
            width="2em"
            margin="0 0 0 0.5em"
            bgrImage={images.saveWhite}
            onClick={() => this.handleSubmitCampaign()}
          />
        </WrapperInput>
        {
          isError && (<Message fontSize="0.7em">{isShowDropdown ? i18n.t('pleaseSaveField') : i18n.t('fieldRequired')}</Message>)
        }
      </div>
    );
  }

  render() {
    const { isError, fontSize } = this.props;
    const { isShowDropdown } = this.state;
    return (
      <Name fontSize={fontSize}>
        {isShowDropdown || isError ? this.renderDropdownCampaign() : (this.renderCampaignName())}
      </Name>
    );
  }
}

ChangeBotCampaign.defaultProps = {
  campaignBot: {
    id: '',
    name: '',
  },
  isChangeBotCampaign: false,
  isError: false,
  fontSize: 0,
};

ChangeBotCampaign.propTypes = {
  campaignBot: PropTypes.objectOf(PropTypes.any),
  updateBotCampaign: PropTypes.func.isRequired,
  isChangeBotCampaign: PropTypes.bool,
  listCampaigns: PropTypes.array.isRequired,
  isError: PropTypes.bool,
  handleChangeProps: PropTypes.func.isRequired,
  fontSize: PropTypes.number,
};

export default ChangeBotCampaign;
