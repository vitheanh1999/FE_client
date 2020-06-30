import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ContentHeader, MedianStrip, ButtonStatus, WrapperStatus,
} from '../common/CommonStyle';
import {
  BodyContent, WrapperBot, Wrapper, Img, ContentContainer,
} from './DashBoardStyle';
import images from '../../theme/images';
import i18n from '../../i18n/i18n';
import { TAB } from '../../constants/Constants';

class QuickViewAutoBot extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() { }

  render() {
    const { listBots, handleChangeTab } = this.props;
    const totalBotOn = listBots.filter(item => item.status === 1).length;
    const totalBotOff = listBots.filter(item => item.status === 0).length;
    return (
      <ContentContainer>
        <ContentHeader>
          <span>
            {i18n.t('autoBot')} :
            <span><Img src={images.onStatus} alt="on" />{totalBotOn}</span>
            <span><Img src={images.offStatus} alt="off" />{totalBotOff}</span>
          </span>
          <Img src={images.btnDetail} onClick={() => handleChangeTab(TAB.BOT)} />
        </ContentHeader>
        <MedianStrip />
        <BodyContent>
          <Wrapper>
            { listBots.map(item => (
              <WrapperBot key={item.id}>
                <WrapperStatus>
                  {item.status === 1
                    ? (<ButtonStatus isOn>{i18n.t('on')}</ButtonStatus>)
                    : (<ButtonStatus>{i18n.t('off')}</ButtonStatus>)
                }

                  <span>{item.name}</span>
                </WrapperStatus>
              </WrapperBot>
            ))
        }
          </Wrapper>
        </BodyContent>
      </ContentContainer>
    );
  }
}

QuickViewAutoBot.defaultProps = {
  listBots: [],
};

QuickViewAutoBot.propTypes = {
  listBots: PropTypes.array,
  handleChangeTab: PropTypes.func.isRequired,
};

export default QuickViewAutoBot;
