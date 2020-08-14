import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import { ModalHeaderCustom } from '../common/CommonStyle';
import i18n from '../../i18n/i18n';
import {
  TitleGroup, FieldContent, Row,
} from '../campaign/detail/tabBasicSettingStyle';
import { TABS } from './CardNoTable';

const HELP_LOGIC = [
  {
    id: 1,
    name: '',
    content: '',
  },
  {
    id: 2,
    name: 'description',
    content: '',
  },
  {
    id: 3,
    name: 'customCampaign.cardNo',
    content: 'help.cardNo',
  },
  {
    id: 4,
    name: '',
    content: '',
  },
  {
    id: 5,
    name: 'winNext',
    content: 'help.winNext',
  },
  {
    id: 6,
    name: 'loseNext',
    content: 'help.loseNext',
  },
];

const Wrapper = styled.div`
  width: 100%;
`;

const HelpWrapper = styled.div`
  max-height: 50vh;
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  margin: 0.6em;
  padding-top: 0.5em;
  width: 100%;
`;

const ModalWrapper = styled(Modal)`
  > div {
    background-color: #333333;
    color: #fcfcfc;
  }
`;

const FooterWrapper = styled.div`
  width: 100%;
  display:flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 0.4em;
`;

const ButtonOK = styled.div`
  background-color: #23b083;
  border-radius: 0.2em;
  width: 5em;
  padding: 0.1em 0;
  font-weight: bold;
  cursor: pointer;
  margin: 0.5em 0;
  display: flex;
  justify-content: center;
  align-items: center;

  &: hover {
    background-color: #23b083aa;
  }
`;

class PopUpHelp extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.renderHelp = this.renderHelp.bind(this);
  }

  renderHelp() {
    const { currentTabId } = this.props;
    const listHelp = HELP_LOGIC.map((item) => {
      const itemCopy = { ...item };
      if (itemCopy.id === 1) {
        itemCopy.name = currentTabId === TABS.LIST_LOGIC_BET.id ? 'customCampaign.logicPatternName' : 'betPattern';
        itemCopy.content = currentTabId === TABS.LIST_LOGIC_BET.id ? 'help.nameLogicPattern' : 'help.nameBetPattern';
      }
      if (itemCopy.id === 2) {
        itemCopy.content = currentTabId === TABS.LIST_LOGIC_BET.id ? 'help.descriptionLogicPattern' : 'help.descriptionBetPattern';
      }
      if (itemCopy.id === 4) {
        itemCopy.name = currentTabId === TABS.LIST_LOGIC_BET.id ? 'betPoint' : 'betValue';
        itemCopy.content = currentTabId === TABS.LIST_LOGIC_BET.id ? 'help.betPoint' : 'help.betValue';
      }
      return (
        <div key={itemCopy.id}>
          <Row>
            <TitleGroup>
              ■{i18n.t(itemCopy.name)}
            </TitleGroup>
          </Row>
          <FieldContent> {i18n.t(itemCopy.content)}</FieldContent>
        </div>
      );
    });
    return listHelp;
  }

  render() {
    const { isOpen, onClose } = this.props;
    return (
      <ModalWrapper
        id="DetailModal"
        isOpen={isOpen}
        centered
      >
        <ModalHeaderCustom toggle={onClose}>
          {i18n.t('help2')}
        </ModalHeaderCustom>
        <Wrapper>
          <HelpWrapper>
            {this.renderHelp()}
          </HelpWrapper>
        </Wrapper>
        <FooterWrapper>
          <ButtonOK onClick={onClose}>
            {i18n.t('ok')}
          </ButtonOK>
        </FooterWrapper>
      </ModalWrapper>
    );
  }
}

PopUpHelp.propTypes = {
  currentTabId: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
};

PopUpHelp.defaultProps = {
  isOpen: false,
};

export default PopUpHelp;
