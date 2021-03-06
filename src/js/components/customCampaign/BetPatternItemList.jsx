import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import i18n from '../../i18n/i18n';
import { images } from '../../theme';
import {
  WrapperListItem, ListInformation, ListDescription, Description,
} from '../common/CommonStyle';
import {
  Title,
  WrapperAction,
  ButtonAction,
  Image,
} from '../campaign/campaignStyle';
import DeleteBetPatternButton from './detail/DeleteBetPatternButton';
import { renderField } from './LogicPatternItem';

class BetPatternItemList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      statusContent: true,
    };
  }

  changeContent() {
    const { statusContent } = this.state;
    this.setState({ statusContent: !statusContent });
  }

  renderAction() {
    const { betPatternInfo, showPopupDetail, handleDelete } = this.props;
    const buttonDelete = (
      <DeleteBetPatternButton
        handleDelete={handleDelete}
        betPatternInfo={betPatternInfo}
      />
    );

    return (
      <Fragment>
        <ButtonAction
          fontSize="1em"
          hoverBgColor="#20bcdf"
          padding={isMobile ? '0.5em' : '0.2em 0.5em 0.2em 0.5em'}
          opacity="0.5"
          margin="0 1em 0.7em 0"
          color="#2d889c"
          height={2}
          onClick={e => showPopupDetail(
            e, betPatternInfo, betPatternInfo.count_bot_off_use_bet,
            betPatternInfo.count_bot_on_use_bet,
          )}
        >
          {isMobile || i18n.t('edit')}
          <Image src={images.edit2} alt="" />
        </ButtonAction>
        {buttonDelete}
      </Fragment>
    );
  }

  render() {
    const { betPatternInfo } = this.props;
    const { statusContent } = this.state;
    return (
      <WrapperListItem onClick={() => this.changeContent()}>
        {
          statusContent
            ? (
              <ListInformation>
                <Title>{betPatternInfo.bet_pattern_name}</Title>
                {renderField(
                  i18n.t('betPattern.numberCampaignUsed'),
                  betPatternInfo.count_campaign_use_bet,
                  i18n.t('betPattern.amountCampaign'),
                )}
                {renderField(
                  i18n.t('betPattern.numberBotUsed'),
                  betPatternInfo.count_bot_on_use_bet,
                  i18n.t('betPattern.amountBot'),
                )}
              </ListInformation>
            )
            : (
              <ListDescription>
                <Title>{betPatternInfo.bet_pattern_name}</Title>
                <Description>
                  {betPatternInfo.description}
                </Description>
              </ListDescription>
            )
        }
        <WrapperAction>{this.renderAction()}</WrapperAction>
      </WrapperListItem>
    );
  }
}

BetPatternItemList.defaultProps = {
};

BetPatternItemList.propTypes = {
  betPatternInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  showPopupDetail: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default BetPatternItemList;
