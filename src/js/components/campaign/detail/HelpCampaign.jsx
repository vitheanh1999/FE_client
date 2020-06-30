import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import i18n from '../../../i18n/i18n';
import {
  HelpWrapper, Row, TitleGroup, Blank, FieldContent,
} from './tabBasicSettingStyle';

class HelpCampaign extends Component {
  componentDidMount() {
  }

  render() {
    const {
      fieldName, fieldContent, optionName, optionDetailContent,
      // optionDetail,
    } = this.props;
    const content = { __html: optionDetailContent };
    return (
      <HelpWrapper isMobile={isMobile} id="HelpId">
        <TitleGroup>{fieldName ? i18n.t(fieldName) : i18n.t('help')}</TitleGroup>
        <FieldContent>{fieldContent ? i18n.t(fieldContent) : ''}</FieldContent>
        {
          optionName && <Blank height={1.5} />
        }
        <Row>
          <TitleGroup>{ optionName || ''}</TitleGroup>
        </Row>
        {
          // <FieldContent>{ optionDetailContent || '' }</FieldContent>
        }
        <FieldContent dangerouslySetInnerHTML={content} />
      </HelpWrapper>
    );
  }
}

HelpCampaign.defaultProps = {
  fieldName: '',
  fieldContent: '.....',
  optionName: '',
  // optionDetail: '',
  optionDetailContent: '',
};

HelpCampaign.propTypes = {
  fieldName: PropTypes.string,
  fieldContent: PropTypes.string,
  optionName: PropTypes.string,
  // optionDetail: PropTypes.string,
  optionDetailContent: PropTypes.string,
};

export default HelpCampaign;
