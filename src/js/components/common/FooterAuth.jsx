import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { COPYRIGHT } from '../../config';
import images from '../../theme/images';

const Img = styled.img`
  width: 100%;
`;

const Credit = styled.div`
  background: #111;
  color: #aaa;
  font-size: 90%;
  text-align: center;
  padding: 10px 0;
`;

const Link = styled.a`
  display: block;
  color: #60ad51;
  text-decoration: none;
  text-align: left;

  :hover {
    color: #60ad51bb;
  }
`;

const Logo = styled(Link)`
  width: 200px;
`;

const Li = styled.li`
  color: #ccc;
  margin: 0 60px 20px 20px;
  text-align: left;
`;

const FooterLink = styled.div`
  display: flex;
  margin: 40px 0;
  flex-wrap: wrap;
`;

const FooterInner = styled.div`
  width: 1020px;
  margin: 0 auto;
  overflow: hidden;
`;

const FooterArea = styled.div`
  overflow-x: hidden;
  background: #222 url(${images.footerBackground}) no-repeat;
  background-size: 30%;
  background-position: right 40px top;
`;

class FooterAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const { isLoggedIn } = this.props;
    return (
      <FooterArea id="footer">
        <FooterInner className="inner">
          <FooterLink className="links">
            <ul>
              <Li>About LUC888</Li>
              <Li>
                <Logo className="logo">
                  <Img src={images.logoRectangle02} alt="LUC888" />
                </Logo>
              </Li>
              {
                (!isLoggedIn) && <Li><Link href="/register">Register Now</Link></Li>
              }
              <Li><Link href="https://luc888.co/terms-of-user">Terms and Conditions</Link></Li>
              <Li><Link href="https://luc888.co/privacy-policy">Privacy Policy</Link></Li>
            </ul>
            <ul>
              <Li>Menu</Li>
              <Li><Link href="https://luc888.co/#info">News & Promotions</Link></Li>
              <Li><Link href="https://luc888.co/#rule">Rules of Baccarat</Link></Li>
              <Li><Link href="https://luc888.co/#guide">Play guide</Link></Li>
              <Li><Link href="https://luc888.co/#event">Event</Link></Li>
            </ul>
            <ul>
              <Li>Payment method</Li>
              <Li>
                <Img src={images.tetherLogoWhiteDiamond} width="180" alt="TetherLogo_white_diamond" />
              </Li>
              <Li>
                <Img src={images.btcLogoWhiteDiamond} width="180" alt="TetherLogo_white_diamond" />
              </Li>
            </ul>
          </FooterLink>
        </FooterInner>
        <Credit className="credit">{COPYRIGHT}</Credit>
      </FooterArea>
    );
  }
}

FooterAuth.propTypes = {
  isLoggedIn: PropTypes.bool,
};

FooterAuth.defaultProps = {
  isLoggedIn: true,
};

export default FooterAuth;
