import React, { PureComponent, Fragment } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import i18n from '../../i18n/i18n';
import { images } from '../../theme';
import {
  WrapperAction, ButtonAction, Image,
  Row, FieldText, Title,
} from '../campaign/campaignStyle';
import {
  WrapperListItem, ListInformation, ListDescription, Description,
} from '../common/CommonStyle';
import DeleteLogicPatternButton from './DeleteLogicPatternButton';

const ENABLE_DELETE_CAMPAIGN = true;

const NumberLogic = styled.span`
  font-weight: bold;
  margin: 3px;
`;

export const renderField = (name, number, value) => (
  <Row>
    <FieldText>{name.concat('：')}</FieldText>
    <NumberLogic>{number}</NumberLogic>
    <FieldText style={{ marginLeft: 'unset', }}>{value}</FieldText>
  </Row>
);

class LogicPatternItem extends PureComponent {
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
    const { logicPatternInfo, handleDelete, showPopupDetail } = this.props;
    const buttonDelete = ENABLE_DELETE_CAMPAIGN && (
      <DeleteLogicPatternButton
        handleDelete={handleDelete}
        logicPatternInfo={logicPatternInfo}
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
            e, logicPatternInfo, logicPatternInfo.count_bot_off_use_logic,
            logicPatternInfo.count_bot_on_use_logic,
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
    const { logicPatternInfo } = this.props;
    const { statusContent } = this.state;

    return (
      <WrapperListItem onClick={() => this.changeContent()}>
        {
            statusContent
              ? (
                <ListInformation>
                  <Title>{logicPatternInfo.logic_pattern_name}</Title>
                  {renderField(
                    i18n.t('betPattern.numberCampaignUsed'),
                    logicPatternInfo.count_campaign_use_logic,
                    i18n.t('betPattern.amountCampaign'),
                  )}

                  {renderField(
                    i18n.t('betPattern.numberBotUsed'),
                    logicPatternInfo.count_bot_on_use_logic,
                    i18n.t('betPattern.amountBot'),
                  )}
                </ListInformation>
              )
              : (
                <ListDescription>
                  <Title>{logicPatternInfo.logic_pattern_name}</Title>
                  <Description>
                    {logicPatternInfo.description}
                  </Description>
                </ListDescription>
              )
          }

        <WrapperAction>
          {this.renderAction()}
        </WrapperAction>
      </WrapperListItem>
    );
  }
}

LogicPatternItem.defaultProps = {
};

LogicPatternItem.propTypes = {
  logicPatternInfo: PropTypes.objectOf(PropTypes.any).isRequired,
  handleDelete: PropTypes.func.isRequired,
  showPopupDetail: PropTypes.func.isRequired,
};

export default LogicPatternItem;
