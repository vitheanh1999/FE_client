import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from '../../i18n/i18n';
import { images } from '../../theme';
import Alert from '../common/Alert/Alert';
import { BOT_STATUSES } from '../../constants/Constants';
import { ButtonCore } from '../listBots/listBotsStyle';

class BotDeletePopup extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.onDeleteBot = this.onDeleteBot.bind(this);
  }

  onDeleteBot() {
    const { bot, handleDeleteBot } = this.props;
    if (bot.GC > 0) {
      Alert.instance.showAlert(i18n.t('error'), i18n.t('requireCharge'));
    } else {
      Alert.instance.showAlertTwoButtons(
        i18n.t('warning'),
        i18n.t('deleteBotConfirm'),
        [i18n.t('cancel'), i18n.t('ok')],
        [
          () => Alert.instance.hideAlert(),
          () => {
            handleDeleteBot(bot.id);
            Alert.instance.hideAlert();
          },
        ],
        Alert.instance.hideAlert(),
      );
    }
  }

  render() {
    const { bot } = this.props;
    const isOff = bot.status === BOT_STATUSES.OFF && !bot.remain_time;

    if (!isOff) return '';
    return (
      <div>
        <ButtonCore
          fontSize="1em"
          hoverBgColor="#23B083"
          padding="0.2em 0.5em 0.2em 0.5em"
          onClick={() => this.onDeleteBot()}
          opacity="0.5"
        >
          <img
            src={images.deleteIcon}
            alt="view mode"
            id="view-mode-btn"
          />
        </ButtonCore>
      </div>
    );
  }
}

BotDeletePopup.propTypes = {
  bot: PropTypes.object.isRequired,
  handleDeleteBot: PropTypes.func.isRequired,
};

export default BotDeletePopup;
