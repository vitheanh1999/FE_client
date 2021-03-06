import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from '../../../i18n/i18n';
import {
  Wrapper, TitleGroup,
  Row, TitleField, Blank,
  Column, renderButtonHelp, WrapperArea,
} from './tabBasicSettingStyle';
import FormCampaign from './FormCampaign';
import HelpCampaign from './HelpCampaign';
import Dropdown from '../../common/Dropdown/Dropdown';

export const OPTIONS_MODE = [
  {
    text: i18n.t('mode_1'),
    id: 1,
    description: i18n.t('descriptionMode1'),
  },
  {
    text: i18n.t('mode_2'),
    id: 2,
    description: i18n.t('descriptionMode2'),
  },
];

class TabAdvanceSetting extends Component {
  componentDidMount() {
  }

  creatButtonHelp(fieldName, fieldContent, optionName, optionDetail) {
    const { helpData, onClickHelp } = this.props;

    return renderButtonHelp(fieldName, helpData.fieldName, () => {
      if (onClickHelp) onClickHelp(fieldName, fieldContent, optionName, optionDetail);
    });
  }

  render() {
    const {
      campaignData, onChangeAdvance,
      valid, helpData, isMobile,
      onClickHelp, maxWidth,
    } = this.props;
    const {
      nearest_turns: nearestTurns,
      win_rate_value: winRate,
      zero_bet_mode: zeroModeId,
    } = campaignData.data;

    return (
      <Wrapper isMobile={isMobile}>
        <Column>
          <Blank height={1} />
          <WrapperArea portraitMode={isMobile}>
            <TitleGroup style={{ marginLeft: 0 }}>{i18n.t('zeroBet')}</TitleGroup>
            <Row>
              <TitleField width={7} style={{ marginLeft: '1em' }}>{i18n.t('nearestTurns')}</TitleField>
              <FormCampaign
                onChange={e => onChangeAdvance(e, 'nearest_turns')}
                isValid={valid.nearest_turns.isValid}
                invalidText={valid.nearest_turns.invalidText}
                margin={valid.nearest_turns.isValid ? '' : '1em 0 0 0'}
                name="nearestTurn"
                pattern="[0-9]*"
                labelPaddingBottom={4}
                value={nearestTurns && nearestTurns.toString()}
                width={maxWidth}
              />
              {this.creatButtonHelp('nearestTurns', 'help.nearestTurn', '', '')}
            </Row>
            <Blank height={0.5} />
            <Row>
              <TitleField width={7} style={{ marginLeft: '1em' }}>{i18n.t('winRate')}</TitleField>
              <FormCampaign
                onChange={e => onChangeAdvance(e, 'win_rate_value')}
                isValid={valid.win_rate_value.isValid}
                invalidText={valid.win_rate_value.invalidText}
                margin={valid.win_rate_value.isValid ? '' : '1em 0 0 0'}
                name="winRate"
                pattern="[0-9]*"
                labelPaddingBottom={4}
                value={winRate && winRate.toString()}
                width={maxWidth}
              />
              {this.creatButtonHelp('winRate', 'help.winRate', '', '')}
            </Row>
            <Blank height={0.5} />
            <Row>
              <TitleField width={7} style={{ marginLeft: '1em' }}>{i18n.t('mode')}</TitleField>
              <Dropdown
                data={OPTIONS_MODE}
                defaultSelectedId={zeroModeId}
                ignoreWhenReselect
                onChangeSelected={(id) => {
                  const event = {
                    target: {
                      value: id,
                      validity: { valid: true },
                    },
                  };
                  onChangeAdvance(event, 'zero_bet_mode');
                  onClickHelp(`mode_${id}`, `help.zeroMode${id}`, '', '');
                }}
                width={maxWidth}
              />
              {this.creatButtonHelp(`mode_${zeroModeId}`, `help.zeroMode${zeroModeId}`, '', '')}
            </Row>
          </WrapperArea>
          <Blank height={1} />
          <WrapperArea portraitMode={isMobile}>
            <Row>
              <TitleGroup width={8} style={{ marginLeft: 0 }}>{i18n.t('look')}</TitleGroup>
              <FormCampaign
                onChange={e => onChangeAdvance(e, 'look_rate_value')}
                isValid={valid.look_rate_value.isValid}
                invalidText={valid.look_rate_value.invalidText}
                margin={valid.look_rate_value.isValid ? '' : '1em 0 0 0'}
                name="look"
                pattern="[0-9]*"
                labelPaddingBottom={4}
                value={campaignData.data.components[0].look_rate_value.toString()}
                width={maxWidth}
              />
              {this.creatButtonHelp('look', 'help.look', '', '')}
            </Row>
          </WrapperArea>
          <Blank height={2} />
        </Column>
        <HelpCampaign
          fieldName={helpData.fieldName}
          fieldContent={helpData.fieldContent}
          optionName={helpData.optionName}
          optionDetail={helpData.optionDetail}
        />
      </Wrapper>
    );
  }
}

TabAdvanceSetting.defaultProps = {
  helpData: null,
  onClickHelp: null,
};

TabAdvanceSetting.propTypes = {
  campaignData: PropTypes.objectOf(PropTypes.any).isRequired,
  isMobile: PropTypes.bool.isRequired,
  helpData: PropTypes.objectOf(PropTypes.any),
  onClickHelp: PropTypes.func,
  onChangeAdvance: PropTypes.func.isRequired,
  valid: PropTypes.objectOf(PropTypes.any).isRequired,
  maxWidth: PropTypes.number.isRequired,
};

export default TabAdvanceSetting;
