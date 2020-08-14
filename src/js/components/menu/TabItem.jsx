import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import colors from '../../theme/colors';
import i18n from '../../i18n/i18n';

const Blank = styled.div`
  height: ${props => props.height}em;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  align-items: center;
  position: relative;
  width: 100%;
  margin-left: auto;
  margin-right: auto;

  &:hover {
    background: #00647aad;
  }
  background: ${props => (props.isActive ? '#00647a' : '')};
`;

const RightTriangleWrapper = styled.div`
  display: flex;
  position: absolute;
  right: -0.111em;
  top: 2.2em;
  justify-content: center;
`;

const RightTriangle = styled.div`
  border-top: 0.75em solid transparent;
  border-bottom: 0.75em solid transparent;
  border-right: 0.75em solid #252525;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  letter-spacing: 0.1em;
  font-weight: bold;
  color: #fff;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  letter-spacing: 0.1em;
  font-weight: bold;
  color: ${props => (props.isActive ? colors.secondary : 'rgba(255, 255, 255, 0.4)')};
  font-size: ${props => (props.fontSize)};
  white-space: nowrap;

  &:hover {
    color: ${colors.secondary};
  }
`;

// const SubTitle = styled.div`
//   font-size: 0.65em;
//   font-weight: bold;
//   color: #fff;
// `;

const Icon = styled.img`
  width: 4em;
`;

export const IconContent = styled.div`
  position: relative;
`;

export const Round = styled.div`
  min-width: 2em;
  height: 2em;
  background-color: #3095cb;
  border-radius: 5em;
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  padding-left: 0.3em;
  padding-right: 0.3em;
`;

class TabItem extends Component {
  componentDidMount() {
  }

  renderTriangle() {
    const { active } = this.props;
    if (active) {
      return (
        <RightTriangleWrapper>
          <RightTriangle />
        </RightTriangleWrapper>
      );
    }
    return null;
  }

  render() {
    const {
      title,
      // subTitle,
      onClick,
      active,
      fontSize,
      icon,
      unReadNew,
    } = this.props;

    return (
      <Wrapper
        onClick={onClick}
        isActive={active}
      >
        <Blank height={0.5} />
        <IconContent>
          <Icon src={icon} />
          {
            unReadNew && (<Round>{unReadNew}</Round>)
          }
        </IconContent>
        <TitleWrapper>
          <Title
            fontSize={fontSize}
            isActive={active}
          >
            {i18n.t(title)}
          </Title>
          { /* <SubTitle>{subTitle}</SubTitle> */}
        </TitleWrapper>
        <Blank height={0.5} />
        {this.renderTriangle()}
      </Wrapper>
    );
  }
}

export default TabItem;


TabItem.defaultProps = {
  active: false,
  // subTitle: '',
  fontSize: '1.25em',
  unReadNew: '',
};

TabItem.propTypes = {
  fontSize: PropTypes.string,
  title: PropTypes.string.isRequired,
  // subTitle: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  unReadNew: PropTypes.string,
};
