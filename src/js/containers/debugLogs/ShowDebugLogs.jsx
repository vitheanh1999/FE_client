import React, { Component } from 'react';
import { SHOW_DEBUG_LOG } from '../../helpers/debugLogMobile';
import {
  ButtonShowLog, Wrapper, WrapperLog, ButtonReload,
} from './showDebugLogsStyle';
import TabMenu from '../../components/campaign/detail/TabMenu';
import LogItem from '../../components/debugLogs/LogItem';
import SearchLog from '../../components/debugLogs/SearchLog';


const listTab = [
  { id: 1, text: 'All' },
  { id: 2, text: 'Log' },
  { id: 3, text: 'Error' },
];

const renderLogs = listLog => (
  <WrapperLog>
    {
        listLog.map(item => <LogItem content={item} />)
      }
  </WrapperLog>
);

class ShowDebugLogs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      tabId: listTab[0].id,
      contentSearch: '',
      valueInput: '',
      clearInputStatus: false,
    };
    this.onChangeTab = this.onChangeTab.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  onResize() {
    this.setState({});
  }

  onChangeTab(tabId) {
    this.setState({ tabId });
    let content = console.logsAll;
    if (tabId === listTab[1].id) {
      content = console.logs;
    } else if (tabId === listTab[2].id) {
      content = console.logsError;
    }
    this.handleSearch(this.state.valueInput, content);
  }

  onClickButtonShow() {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  }

  renderButtonShowLog() {
    return (
      <ButtonShowLog onClick={() => this.onClickButtonShow()}>+</ButtonShowLog>
    );
  }

  handleSearch(value, content) {
    let newContent = [];
    if (value.length <= 0) {
      newContent = content;
    } else {
      value.toLowerCase();
      for (const item of content) {
        if (item.toString().toLowerCase().indexOf(value) > -1) {
          newContent.push(item);
        }
      }
    }
    this.setState({
      clearInputStatus: !!value,
      contentSearch: newContent,
      valueInput: value,
    });
  }

  clearValue(content) {
    this.setState({
      clearInputStatus: false,
      contentSearch: content,
      valueInput: '',
    });
  }

  render() {
    if (!SHOW_DEBUG_LOG) return null;
    const {
      visible, tabId, contentSearch, valueInput, clearInputStatus,
    } = this.state;
    if (!visible) return this.renderButtonShowLog();
    let content = console.logsAll;
    if (tabId === listTab[1].id) {
      content = console.logs;
    } else if (tabId === listTab[2].id) {
      content = console.logsError;
    }
    return (
      <Wrapper>
        <TabMenu
          tabs={listTab}
          onChangeTab={this.onChangeTab}
          selectTedId={tabId}
          customStyle={{ fontSize: '1em' }}
        />
        <SearchLog
          clearInputStatus={clearInputStatus}
          valueInput={valueInput}
          handleSearch={value => this.handleSearch(value, content)}
          clearValue={content => this.clearValue(content)}
        />
        {
          contentSearch ? renderLogs(contentSearch) : renderLogs(content)
        }
        {
          this.renderButtonShowLog()
        }
        <ButtonReload onClick={() => this.forceUpdate()}>Reload</ButtonReload>
      </Wrapper>
    );
  }
}

export default ShowDebugLogs;
