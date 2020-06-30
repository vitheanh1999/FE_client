import React, { Component } from 'react';
import styled from 'styled-components';
import Helmet from 'react-helmet';
import images from '../../theme/images';

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  font-size: 3em;
  font-weight: bold;
`;

const Content = styled.div`
  background-image: url(${images.logoUrlInvalid});
  width: 380px;
  height: 280px;
  background-repeat: no-repeat;
  position: relative;
`;

const Text = styled.div`
  position: absolute;
  top: 123px;
  left: 168px;
`;

class NotFound extends Component {
  constructor(props) {
    super(props);
    this.state = {
      urlInvalid: true,
    };
  }

  componentDidMount() {
  }

  renderNotFound() {
    const { urlInvalid } = this.state;
    if (!urlInvalid) return null;
    return (
      <Wrapper>
        <Helmet>
          <title>Fifties Hacker</title>
          <link rel="icon" type="image/png" sizes="180x180" href={images.FEFavicon} />
          <meta name="title" content="Default Title" />
        </Helmet>
        <Content>
          <Text>Url invalid</Text>
        </Content>
      </Wrapper>
    );
  }

  render() {
    return this.renderNotFound();
  }
}

export default NotFound;
