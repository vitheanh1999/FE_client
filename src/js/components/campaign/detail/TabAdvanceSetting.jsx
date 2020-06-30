import React, { Component } from 'react';
import PropTypes from 'prop-types';
import i18n from '../../../i18n/i18n';
import {
  Wrapper, TitleGroup,
  Row, TitleField, Blank,
  Column, renderButtonHelp,
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
      valid, helpData, isMobile, onClickHelp,
    } = this.props;
    const {
      nearest_turns: nearestTurns,
      win_rate_value: winRate,
      zero_bet_mode: zeroModeId,
    } = campaignData.data;

    return (
      <Wrapper isMobile={isMobile}>
        <Column>
          <Blank height={0.5} />
          <TitleGroup>{i18n.t('zeroBet')}</TitleGroup>
          <Row>
            <TitleField width={8}>{i18n.t('nearestTurns')}</TitleField>
            <FormCampaign
              onChange={e => onChangeAdvance(e, 'nearest_turns')}
              isValid={valid.nearest_turns.isValid}
              invalidText={valid.nearest_turns.invalidText}
              margin={valid.nearest_turns.isValid ? '' : '1em 0 0 0'}
              name="nearestTurn"
              pattern="[0-9]*"
              labelPaddingBottom={4}
              value={nearestTurns && nearestTurns.toString()}
            />
            {this.creatButtonHelp('nearestTurns', 'help.nearestTurn', '', '')}
          </Row>
          <Blank height={0.5} />
          <Row>
            <TitleField width={8}>{i18n.t('winRate')}</TitleField>
            <FormCampaign
              onChange={e => onChangeAdvance(e, 'win_rate_value')}
              isValid={valid.win_rate_value.isValid}
              invalidText={valid.win_rate_value.invalidText}
              margin={valid.win_rate_value.isValid ? '' : '1em 0 0 0'}
              name="winRate"
              pattern="[0-9]*"
              labelPaddingBottom={4}
              value={winRate && winRate.toString()}
            />
            {this.creatButtonHelp('winRate', 'help.winRate', '', '')}
          </Row>
          <Blank height={0.5} />
          <Row>
            <TitleField width={8}>{i18n.t('mode')}</TitleField>
            <Dropdown
              data={OPTIONS_MODE}
              defaultSelectedId={zeroModeId}
              ignoreWhenReselect
              width={15.3}
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
            />
            {this.creatButtonHelp(`mode_${zeroModeId}`, `help.zeroMode${zeroModeId}`, '', '')}
          </Row>
          <Blank height={1} />
          <Row>
            <TitleGroup width={7.28}>{i18n.t('look')}</TitleGroup>
            <FormCampaign
              onChange={e => onChangeAdvance(e, 'look_rate_value')}
              isValid={valid.look_rate_value.isValid}
              invalidText={valid.look_rate_value.invalidText}
              margin={valid.look_rate_value.isValid ? '' : '1em 0 0 0'}
              name="look"
              pattern="[0-9]*"
              labelPaddingBottom={4}
              value={campaignData.data.components[0].look_rate_value.toString()}
            />
            {this.creatButtonHelp('look', 'help.look', '', '')}
          </Row>
          <Blank height={1} />
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
};

export default TabAdvanceSetting;
