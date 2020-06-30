import React from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import NotFound from '../notFound/NotFound';
import { calculatorFontSize } from '../login/SuperLogin';
import images from '../../theme/images';

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
`;

class Guide extends NotFound {
  constructor(props) {
    super(props);
    this.state = {
      numberGuide: 11,
    };

    this.refAlert = null;
    this.getAlertRef = this.getAlertRef.bind(this);
    this.onResize = this.onResize.bind(this);
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
    const { numberGuide } = this.state;
    const nameBgrImages = 'guide';
    const listGuide = [];
    for (let i = 1; i < numberGuide + 1; i += 1) {
      const nameBgrImage = nameBgrImages.concat(i);
      listGuide.push(<GuideItem src={images[nameBgrImages][nameBgrImage]} />);
    }
    return listGuide;
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
          {this.renderGuide()}
        </Wrapper>
      </div>
    );
  }
}

Guide.propTypes = {
};

export default Guide;
