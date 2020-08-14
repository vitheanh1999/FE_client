import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  Wrapper, TabButton,
} from './tabMenuStyle';
import i18n from '../../../i18n/i18n';


class TabMenu extends PureComponent {
  renderTab(tab) {
    const { selectTedId, onChangeTab } = this.props;
    return (
      <TabButton
        selected={selectTedId === tab.id}
        key={tab.id}
        onClick={() => onChangeTab(tab.id)}
      >
        {tab.text}
      </TabButton>
    );
  }

  render() {
    const { tabs, customStyle } = this.props;
    const listTab = tabs.map(item => this.renderTab(item));

    return (
      <Wrapper style={customStyle}>
        {listTab}
      </Wrapper>
    );
  }
}

TabMenu.defaultProps = {
  tabs: [
    { id: 1, text: i18n.t('basic') },
    { id: 2, text: i18n.t('advance') },
    { id: 3, text: i18n.t('option') },
  ],
  onChangeTab: () => {},
  selectTedId: 1,
  customStyle: {},
};

TabMenu.propTypes = {
  onChangeTab: PropTypes.func,
  tabs: PropTypes.arrayOf(PropTypes.objectOf),
  selectTedId: PropTypes.any,
  customStyle: PropTypes.any,
};

export default TabMenu;
