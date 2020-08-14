import React, { Component, Fragment } from 'react';
import Pagination from 'rc-pagination';
import 'rc-pagination/assets/index.css';
import PropTypes from 'prop-types';
import images from '../../theme/images';
import Alert from '../common/Alert/Alert';
import i18n from '../../i18n/i18n';
import Dropdown from '../common/Dropdown/Dropdown';
import CustomSwitch from '../common/CustomSwitch';
import { SORT_BOT_OPTIONS, BOT_STATUSES } from '../../constants/Constants';
import {
  ButtonViewMode, DropdownArea,
  Image, KeyName, KeyNameText,
  RightSideGroup, TotalGCText,
  getReasonTurnOff, IconViewMode,
  WrapperSpan, TableText,
} from './listBotsStyle';
import {
  WrapperListItem, WrapperList,
  ListInformation, WrapperPaginationCustom,
} from '../common/CommonStyle';
import PopupOnBot from '../common/PopupOnBot/PopupOnBot';
import InfoRemainTime from './InfoRemainTime';
import Countdown from '../common/Countdown';
import StyleNumber from '../StyleNumber';

class BotItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowPopupOnBot: false,
      botSelected: {},
    };

    this.handleUpdateBotStatus = this.handleUpdateBotStatus.bind(this);
  }

  handleUpdateBotStatus(bot, e) {
    e.stopPropagation();
    const { id, status } = bot;
    if (status) {
      Alert.instance.showAlertTwoButtons(
        i18n.t('warning'),
        i18n.t('offBotMessage'),
        [i18n.t('cancel'), i18n.t('ok')],
        [
          () => Alert.instance.hideAlert(),
          () => this.props.handleUpdateBotStatus(id, status, status ? '' : true),
        ],
        Alert.instance.hideAlert(),
      );
    } else {
      this.setState({
        botSelected: bot,
        isShowPopupOnBot: true,
      });
    }
  }

  renderRightSideGroup(bot, data) {
    const { showBotDetail, openGameScene } = this.props;
    return (
      <RightSideGroup>
        <div style={{ display: 'flex' }}>
          <Image
            src={images.btnDetail}
            alt="show detail"
            id="show-detail-btn"
            onClick={() => showBotDetail(bot, data)}
          />
        </div>
        <ButtonViewMode
          onClick={e => openGameScene(e, true, bot)}
        >
          {bot.status !== BOT_STATUSES.OFF ? i18n.t('viewMode') : i18n.t('checkHistory')}
          <IconViewMode
            src={images.btnView}
            alt="view mode"
            id="icon_view_mode"
          />
        </ButtonViewMode>
      </RightSideGroup>
    );
  }

  renderBot(bot, customStyle, data) {
    const { isMobile, showBotDetail } = this.props;
    const { secondsCurrent } = data;
    const isOn = bot.status !== BOT_STATUSES.OFF;
    const isRemainTime = secondsCurrent > 0;
    const disabled = true;
    const keyReason = getReasonTurnOff(bot);
    const remainTime = secondsCurrent / 3;
    const ratioRemainTime = 100 - Math.ceil(remainTime / 25) * 25;
    const bgrColor = !isRemainTime ? ' #002e38' : '#666666';
    if (bot.deleted_at) {
      return '';
    }
    return (
      <WrapperListItem
        key={bot.id}
        isRemainTime={isRemainTime}
        bgrColor={!isOn && keyReason && bgrColor}
        bgrColorHover="#0a5a6c"
        height={!isMobile && 8.5}
        onClick={() => showBotDetail(bot)}
      >
        <ListInformation>
          <KeyName>
            <CustomSwitch
              customStyle={customStyle}
              checked={isOn}
              onChange={(e) => {
                if (!isRemainTime) { this.handleUpdateBotStatus(bot, e); }
              }}
              ratioColor={ratioRemainTime}
              labelOff={!isRemainTime ? i18n.t('offStatus') : i18n.t('messageOffRemainTime')}
              disabled={disabled}
            />
            <KeyNameText>{bot.name}</KeyNameText>
          </KeyName>
          {
            bot.campaign ? (
              <TotalGCText id="campaign" fontSize="0.8em">
                {i18n.t('campaign')} : <span>{bot.campaign.name}</span>
              </TotalGCText>
            ) : ''
          }
          {
            bot.table_name_display && (
              <TableText
                fontSize="0.8em"
              >
                {i18n.t('tableText')} : {bot.table_name_display}
              </TableText>
            )
          }
          <TotalGCText isRed={bot.GC < 0} id="auto-gc" fontSize="1.2em">
            {i18n.t('gc')} : <WrapperSpan><StyleNumber value={bot.GC} afterDot={2} color="#fff" /></WrapperSpan>
          </TotalGCText>

          <InfoRemainTime
            bot={bot}
            data={data}
            isMobile={isMobile}
            handleUpdateBotStatus={this.handleUpdateBotStatus}
          />
        </ListInformation>
        {this.renderRightSideGroup(bot, data)}
      </WrapperListItem>
    );
  }

  render() {
    const {
      listBots, handleSortBots, currentPage, total,
      changePage, fontSize, perPage, updateBotCampaign,
      listCampaigns, fetchBotDetail, fetchListBots,
      updateBotStatus, lucUserGC, fetchUser, isMobile,
      listTable, fetchListTable, timeUpdateListBot,
    } = this.props;
    const { isShowPopupOnBot, botSelected } = this.state;
    const customStyle = {
      transform: `scale(${fontSize / 20})`,
      transformOrigin: 'left',
      justifyContent: 'flex-start',
      maxWidth: '3em',
    };
    const delayFromLastUpdateListBot = (new Date() - timeUpdateListBot) / 1000;
    const bots = listBots.map(bot => (
      <Countdown
        seconds={
          bot.remain_time - delayFromLastUpdateListBot > 0
            ? bot.remain_time - delayFromLastUpdateListBot
            : 0
        }
        renderTime={data => this.renderBot(bot, customStyle, data)}
        key={bot.id}
      />
    ));
    return (
      <Fragment>
        <WrapperList>
          <DropdownArea>
            {
              total > 1 ? (
                <Dropdown
                  title={i18n.t('sortBy')}
                  data={SORT_BOT_OPTIONS}
                  onChangeSelected={handleSortBots}
                />
              ) : ''
            }
          </DropdownArea>
          {
            bots
          }
          {
            (total / perPage > 1) ? (
              <WrapperPaginationCustom>
                <Pagination
                  type="autoBot"
                  current={currentPage}
                  total={total}
                  onChange={changePage}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '1em',
                  }}
                />
              </WrapperPaginationCustom>
            ) : ''
          }
        </WrapperList>
        {
          isShowPopupOnBot && (
            <PopupOnBot
              onClose={() => this.setState({ isShowPopupOnBot: false })}
              bot={botSelected}
              updateBotCampaign={updateBotCampaign}
              listCampaigns={listCampaigns}
              fetchBotDetail={fetchBotDetail}
              fetchListBots={fetchListBots}
              fetchListTable={fetchListTable}
              updateBotStatus={updateBotStatus}
              lucUserGC={lucUserGC}
              fetchUser={fetchUser}
              isMobile={isMobile}
              listTable={listTable}
            />
          )
        }
      </Fragment>
    );
  }
}

BotItem.defaultProps = {
  listTable: [],
  listBots: [],
  total: 0,
};

BotItem.propTypes = {
  listBots: PropTypes.array,
  timeUpdateListBot: PropTypes.any.isRequired,
  listTable: PropTypes.array,
  currentPage: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  changePage: PropTypes.func.isRequired,
  showBotDetail: PropTypes.func.isRequired,
  openGameScene: PropTypes.func.isRequired,
  handleSortBots: PropTypes.func.isRequired,
  fontSize: PropTypes.number.isRequired,
  updateBotStatus: PropTypes.func.isRequired,
  total: PropTypes.number,
  updateBotCampaign: PropTypes.func.isRequired,
  listCampaigns: PropTypes.array.isRequired,
  fetchBotDetail: PropTypes.func.isRequired,
  fetchListBots: PropTypes.func.isRequired,
  fetchListTable: PropTypes.func.isRequired,
  lucUserGC: PropTypes.number.isRequired,
  fetchUser: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  handleUpdateBotStatus: PropTypes.func.isRequired,
};

export default BotItem;
