import React, { Component } from 'react';
import 'rc-pagination/assets/index.css';
import PropTypes from 'prop-types';
import i18n from '../../i18n/i18n';
import {
  Message, styleReasonOffBot, Img,
  getReasonTurnOff, ReasonOffBot, ButtonCore,
  ContentRemainTime,
} from './listBotsStyle';

class InfoRemainTime extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const {
      bot, data, disableButtonSuggest,
      handleUpdateBotStatus, isMobile,
    } = this.props;
    const { time, secondsCurrent } = data;
    const isRemainTime = secondsCurrent > 0;
    const keyReason = getReasonTurnOff(bot);
    const checkRemainTime = bot.remain_time > 0 && isRemainTime;
    if (!keyReason) {
      return '';
    }

    return (
      <ContentRemainTime isMobile={isMobile}>
        <ReasonOffBot isMobile={isMobile}>
          <Img src={styleReasonOffBot[keyReason].icon} alt="view mode" id="view-mode-btn" />
          <Message color={styleReasonOffBot[keyReason].color}>
            {i18n.t(keyReason)}
          </Message>
          <Message>
            {
              !checkRemainTime && !disableButtonSuggest && (
                (
                  <ButtonCore
                    fontSize="0.7em"
                    color="#2d889c"
                    hoverBgColor="#20bcdf"
                    padding="0.2em 0.5em 0.2em 0.5em"
                    onClick={e => handleUpdateBotStatus(bot, e)}
                  >
                    {styleReasonOffBot[keyReason].labelOnBot}
                  </ButtonCore>
                )
              )
            }
          </Message>
        </ReasonOffBot>
        {
          checkRemainTime && (
            <span>
              <Message>
                {i18n.t('messageRemainTime')}
              </Message>
              {time}
            </span>
          )
        }
      </ContentRemainTime>
    );
  }
}

InfoRemainTime.propTypes = {
  bot: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  handleUpdateBotStatus: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  disableButtonSuggest: PropTypes.bool,
};

InfoRemainTime.defaultProps = {
  disableButtonSuggest: false,
};

export default InfoRemainTime;
