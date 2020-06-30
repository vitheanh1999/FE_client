import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { convertPatternCampaign } from '../../../helpers/utils';
import i18n from '../../../i18n/i18n';
import {
  Wrapper, TitleGroup, Row,
  Blank, Column, TitleField,
  renderButtonHelp,
  searchDescription,
} from './tabBasicSettingStyle';
import Dropdown from '../../common/Dropdown/Dropdown';
import FormCampaign from './FormCampaign';
import HelpCampaign from './HelpCampaign';

class TabBasicSetting extends Component {
  constructor(props) {
    super(props);
    this.logicRef = React.createRef();
    this.betRef = React.createRef();
    this.creatButtonHelp = this.creatButtonHelp.bind(this);
  }

  componentDidMount() {
  }

  creatButtonHelp(fieldName, fieldContent, optionName, optionDetail, optionDescription = null) {
    const { helpData, onClickHelp } = this.props;
    return renderButtonHelp(fieldName, helpData.fieldName, () => {
      if (onClickHelp) {
        onClickHelp(
          fieldName, fieldContent, optionName, optionDetail, optionDescription,
        );
      }
    });
  }

  render() {
    const {
      campaignData, onChangeNameCampaign, onChangePattern,
      listBetPatterns, listLogicPatterns, valid,
      helpData, isMobile, onChangeBasic, onClickHelp,
      settingPointRate,
    } = this.props;
    const { data, profit_data: profitData } = campaignData;
    const { max_profit: maxProfit, min_profit: minProfit } = profitData;
    const optionLogicPatterns = convertPatternCampaign(listLogicPatterns, data.components[0], 'logic_pattern_name');
    const optionBetPatterns = convertPatternCampaign(listBetPatterns, data.components[0], 'bet_pattern_name');
    const pointRate = campaignData.data.point_rate;

    return (
      <Wrapper isMobile={isMobile}>
        <Column>
          <Blank height={0.5} />
          <Row>
            <TitleGroup width={8}>{i18n.t('name')}</TitleGroup>
            <FormCampaign
              onChange={e => onChangeNameCampaign(e)}
              isValid={valid.name.isValid}
              invalidText={valid.name.invalidText}
              margin={valid.name.isValid ? '' : '1em 0 0 0'}
              name="name"
              maxLength={20}
              labelPaddingBottom={4}
              value={campaignData.name}
            />
            {this.creatButtonHelp('name', 'help.name', '', '')}
          </Row>
          <Blank height={1} />
          <Row>
            <TitleGroup width={9}>{i18n.t('logicPattern')}</TitleGroup>
            {optionLogicPatterns.length > 0 ? (
              <Dropdown
                data={optionLogicPatterns}
                onChangeSelected={(id, infos) => {
                  onChangePattern(infos, 'logic_pattern_id', 'logic_pattern_name', 'logic_pattern_description');
                  onClickHelp(
                    'logicPattern',
                    'help.logicBet',
                    data.components[0].logic_pattern_name,
                    `help.logicBet.${data.components[0].logic_pattern_id}`,
                    infos.description,
                  );
                }}
                defaultSelectedId={data.components[0].logic_pattern_id}
                ref={this.logicRef}
                ignoreWhenReselect
              />
            ) : ''
            }
            {
              this.creatButtonHelp(
                'logicPattern',
                'help.logicBet',
                data.components[0].logic_pattern_name,
                `help.logicBet.${data.components[0].logic_pattern_id}`,
                searchDescription(data.components[0].logic_pattern_id, optionLogicPatterns),
              )
            }
          </Row>
          <Blank height={1} />
          <Row>
            <TitleGroup width={9}>{i18n.t('betPattern')}</TitleGroup>
            {optionBetPatterns.length > 0 ? (
              <Dropdown
                data={optionBetPatterns}
                onChangeSelected={(id, infos) => {
                  onChangePattern(infos, 'bet_pattern_id', 'bet_pattern_name', 'bet_pattern_description');
                  onClickHelp(
                    'betPattern',
                    'help.betPattern',
                    data.components[0].bet_pattern_name,
                    `help.betPattern.${data.components[0].bet_pattern_id}`,
                    infos.description,
                  );
                }}
                defaultSelectedId={data.components[0].bet_pattern_id}
                ref={this.betRef}
                ignoreWhenReselect
              />
            ) : ''
            }
            {
              this.creatButtonHelp(
                'betPattern',
                'help.betPattern',
                data.components[0].bet_pattern_name,
                `help.betPattern.${data.components[0].bet_pattern_id}`,
                searchDescription(data.components[0].bet_pattern_id, optionBetPatterns),
              )
            }
          </Row>
          <Blank height={1} />
          <TitleGroup>{i18n.t('profit')}</TitleGroup>
          <Row>
            <TitleField width={8.7}>{i18n.t('maxProfit')}</TitleField>
            <FormCampaign
              onChange={e => onChangeBasic(e, 'max_profit')}
              isValid={valid.max_profit.isValid}
              invalidText={valid.max_profit.invalidText}
              margin={valid.max_profit.isValid ? '' : '1em 0 0 0'}
              name="maxProfit"
              labelPaddingBottom={4}
              value={maxProfit.toString()}
            />
            {this.creatButtonHelp('maxProfit', 'help.maxProfit', '', '')}
          </Row>
          <Blank height={0.5} />
          <Row>
            <TitleField width={8.7}>{i18n.t('minProfit')}</TitleField>
            <FormCampaign
              onChange={e => onChangeBasic(e, 'min_profit')}
              isValid={valid.min_profit.isValid}
              invalidText={valid.min_profit.invalidText}
              margin={valid.min_profit.isValid ? '' : '1em 0 0 0'}
              name="minProfit"
              labelPaddingBottom={4}
              value={minProfit.toString()}
            />
            {this.creatButtonHelp('minProfit', 'help.minProfit', '', '')}
          </Row>
          <Blank height={1} />
          <Row>
            <TitleGroup width={8}>{i18n.t('pointRate')}</TitleGroup>
            <FormCampaign
              onChange={e => onChangeBasic(e, 'point_rate')}
              isValid={valid.point_rate.isValid}
              invalidText={valid.point_rate.invalidText}
              margin={valid.point_rate.isValid ? '' : '1em 0 0 0'}
              name="pointRate"
              pattern="[0-9]*"
              labelPaddingBottom={4}
              value={pointRate && pointRate.toString()}
              inputText={'Max: '.concat(settingPointRate.max)}
            />
            {this.creatButtonHelp('pointRate', 'help.pointRate', '', '')}
          </Row>
          <Blank height={0.5} />
          <Row>
            <TitleGroup width={11}>{i18n.t('pointRateAdaptation')}</TitleGroup>
            <FormCampaign
              name="pointRateGC"
              labelPaddingBottom={4}
              width={13}
              value={pointRate && (pointRate * 10).toString().concat('GC')}
              disabled
            />
          </Row>
        </Column>
        <HelpCampaign
          fieldName={helpData.fieldName}
          fieldContent={helpData.fieldContent}
          optionName={helpData.optionName}
          optionDetail={helpData.optionDetail}
          optionDetailContent={helpData.optionDetailContent}
        />
      </Wrapper>
    );
  }
}

TabBasicSetting.defaultProps = {
  helpData: null,
  onClickHelp: null,
};

TabBasicSetting.propTypes = {
  campaignData: PropTypes.objectOf(PropTypes.any).isRequired,
  isMobile: PropTypes.bool.isRequired,
  onChangeNameCampaign: PropTypes.func.isRequired,
  helpData: PropTypes.objectOf(PropTypes.any),
  onClickHelp: PropTypes.func,
  onChangePattern: PropTypes.func.isRequired,
  listBetPatterns: PropTypes.array.isRequired,
  listLogicPatterns: PropTypes.array.isRequired,
  onChangeBasic: PropTypes.func.isRequired,
  valid: PropTypes.objectOf(PropTypes.any).isRequired,
  settingPointRate: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default TabBasicSetting;
