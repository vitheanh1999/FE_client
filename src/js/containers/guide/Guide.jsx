import React from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import NotFound from '../notFound/NotFound';
import { calculatorFontSize } from '../login/SuperLogin';
import images from '../../theme/images';
import TabMenu from '../../components/campaign/detail/TabMenu';
import i18n from '../../i18n/i18n';

const Wrapper = styled.div`
  background-image: url(${images.backgroundCaro});
  font-size: ${props => props.fontSize}px;
  background-repeat: repeat;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const GuideItem = styled.img`
  width: 90%;
  margin: 1em;
  max-width: 1080px; // 1200 x 90%
  margin-top: ${props => (props.index === 1 ? 0 : 1)}em;
`;

const WrapperMenu = styled.div`
  width: 90%;
  max-width: 1080px; // 1200 x 90%
`;


const listTab = [
  { id: 1, text: i18n.t('guide.common') },
  { id: 2, text: i18n.t('guide.settingLogic') },
];

const GUIDE_INFO = {
  COMMON: {
    id: 1,
    numberImage: 11,
    preName: 'guide',
  },
  SETTING_LOGIC: {
    id: 2,
    numberImage: 5,
    preName: 'guideSetting',
  },
};

class Guide extends NotFound {
  constructor(props) {
    super(props);
    const { match } = this.props;
    let tab = GUIDE_INFO.COMMON;
    try {
      if (match.params.tab && parseInt(match.params.tab, 10) === GUIDE_INFO.SETTING_LOGIC.id) {
        tab = GUIDE_INFO.SETTING_LOGIC;
      }
    } catch {
      // do nothing
    }
    this.state = { tab };

    this.refAlert = null;
    this.getAlertRef = this.getAlertRef.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    window.addEventListener('resize', this.onResize);
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize() {
    this.setState({});
  }

  getAlertRef() {
    return this.refAlert;
  }

  renderGuide() {
    const { tab } = this.state;
    const nameBgrImages = tab.preName;
    const listGuide = [];
    for (let i = 1; i < tab.numberImage + 1; i += 1) {
      const nameBgrImage = nameBgrImages.concat(i);
      listGuide.push(<GuideItem src={images.guide[nameBgrImage]} key={i} index={i} />);
    }
    return listGuide;
  }

  onChangeTab(tabId) {
    if (tabId === 1) {
      this.setState({ tab: GUIDE_INFO.COMMON });
    } else {
      this.setState({ tab: GUIDE_INFO.SETTING_LOGIC });
    }
  }

  renderTabMenu() {
    const { tab } = this.state;
    return (
      <WrapperMenu>
        <TabMenu
          tabs={listTab}
          onChangeTab={this.onChangeTab}
          selectTedId={tab.id}
          customStyle={{
            fontSize: '1.4em',
          }}
        />
      </WrapperMenu>
    );
  }

  render() {
    const fontSize = calculatorFontSize();
    return (
      <div>
        <Helmet>
          <title>Fifties Hacker</title>
          <link rel="icon" type="image/png" sizes="180x180" href={images.FEFavicon} />
          <meta name="title" content="Default Title" />
        </Helmet>
        <Wrapper
          id="root-content"
          fontSize={fontSize}
        >
          {this.renderTabMenu()}
          {this.renderGuide()}
        </Wrapper>
      </div>
    );
  }
}

Guide.propTypes = {
};

export default Guide;
