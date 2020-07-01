import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
// import { isMobile } from 'react-device-detect';
import { images } from '../../../theme';

const isMobile = false;
const RatioRadius = 0.06667;
const Wrapper = styled.div`
  display: flex;
  width: ${props => props.width}em;
  height: ${props => props.height}em;
  background-color: ${props => props.color};
  justify-content: center;
  align-items: center;
  border-radius: ${props => (Math.min(props.width, props.height) * RatioRadius)}em;
  position: relative;
  border: solid 1px #ccc;
  cursor: pointer;
  color: black;
`;

const ButtonDown = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 0 ${props => (Math.min(props.parentWidth, props.parentHeight) * RatioRadius)}em
  ${props => (Math.min(props.parentWidth, props.parentHeight) * RatioRadius)}em 0;
`;

const WrapperDropdown = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: ${props => props.isFlexColumn && 'column'};
`;

const Title = styled.div`
  margin-right: 1em;
`;

export const IconArrow = styled.img`
  width: 1em;
  margin-right: 0.3em;
  ${props => (props.status ? 'transform: rotate(180deg)' : '')}
`;

const STATUS = {
  Full: 1,
  Min: 2,
};

export const ListItemBg = styled.div`
  position: absolute;
  overflow: auto;
  top: ${props => props.top}em;
  background: #fff;
  border-radius: 0 0 ${props => props.radius}em ${props => props.radius}em;
  max-height: ${props => (props.maxHeight ? props.maxHeight : 20)}em;
  width: ${props => props.width}em;
  overflow-x: hidden;
  z-index: 2;
`;

export const ItemWrapper = styled.div`
  height: ${props => props.height}em;
  margin-top: ${props => props.top}em;
  display: flex;
  flex-direction: row;
  border: solid 1px #ccc;

  &: hover {
    background-color: #2684ff14;
  }
`;

const CurrentItemWrapper = styled.div`
  width: ${props => props.width}em;
  height: ${props => props.height}em;
  margin-top: ${props => props.top}em;
  display: flex;
  flex-direction: row;
`;

export const IconWrapper = styled.div`
  width: ${props => props.width}%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Icon = styled.img`
  width: 60%;
  user-select: none;
`;

export const StatusPoint = styled.div`
  width: 0.6em;
  border-radius: 0.6em;
  height: 0.6em;
  background: ${props => props.color};
  margin-right: 1em;
`;

export const TextWrapper = styled.div`
  width: ${props => props.width}%;
  height: 100%;
  user-select: none;
  white-space: nowrap;
  display: flex;
  font-size: 0.9em;
  line-height: 2em;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
`;

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    Dropdown.instance = this;
    const { data, defaultSelectedId } = this.props;
    const currentInfo = (defaultSelectedId !== null && defaultSelectedId !== undefined)
      ? data.find(item => item.id === defaultSelectedId) : null;

    this.state = {
      status: STATUS.Min,
      currentSelectedId: currentInfo ? currentInfo.id : null,
    };
  }

  componentWillUnmount() {
  }

  resetSelectedOption() {
    this.setState({
      currentSelectedId: -1,
    });
  }

  resetDefaultSelected() {
    const { data, defaultSelectedId } = this.props;
    const currentInfo = (defaultSelectedId !== null && defaultSelectedId !== undefined)
      ? data.find(item => item.id === defaultSelectedId) : null;
    this.setState({
      currentSelectedId: currentInfo ? currentInfo.id : null,
    });
  }

  dropdownOnClick() {
    const { status } = this.state;
    const { isDisable } = this.props;
    if (isDisable) {
      this.setState({ status: STATUS.Min });
      return;
    }

    if (status === STATUS.Full) this.setState({ status: STATUS.Min });
    else this.setState({ status: STATUS.Full });
  }

  dropdownOnBlur() {
    this.setState({ status: STATUS.Min });
  }

  itemOnClick(info) {
    const { isDisable, ignoreWhenReselect } = this.props;
    if (isDisable) {
      this.setState({ status: STATUS.Min });
      return;
    }
    if (info.id !== this.state.currentSelectedId || ignoreWhenReselect === true) {
      this.setState({ currentSelectedId: info.id });
      this.dropdownOnClick();
      const { onChangeSelected, index } = this.props;
      if (onChangeSelected) onChangeSelected(info.id, info, index);
    }
  }

  selectItemId(id) {
    const { data } = this.props;
    const currentInfo = (id !== null && id !== undefined)
      ? data.find(item => item.id === id) : null;
    let selectedId = -1;
    if (currentInfo && currentInfo.id !== null && currentInfo.id !== undefined) {
      selectedId = currentInfo.id;
    }
    this.setState({ currentSelectedId: selectedId });
  }

  // fake validate function
  validate() {
    return true;
  }

  renderCurrentItem() {
    const { currentSelectedId } = this.state;
    const {
      data, width, height, currentSelectedStyle, betweenDistance, moreStyle,
    } = this.props;
    const info = data.find(item => item.id === currentSelectedId);
    if (!info) return <div />;
    return (
      <CurrentItemWrapper
        width={width}
        height={height}
        top={betweenDistance}
        style={currentSelectedStyle}
      >
        <IconWrapper width={info.icon ? 25 : 1} style={moreStyle.IconWrapperStyle}>
          {
            info.icon && <Icon src={info.icon} alt="" style={moreStyle.IconStyle} />
          }
        </IconWrapper>
        <TextWrapper width={85}>
          {info.nameDisplay}
          <StatusPoint color={info.color} />
        </TextWrapper>
      </CurrentItemWrapper>
    );
  }

  renderItem(info, index, dataLength) {
    const {
      width, height, customItemStyle, betweenDistance, moreStyle,
    } = this.props;
    return (
      <ItemWrapper
        key={index}
        width={width}
        checkScroll={dataLength >= 10}
        height={height}
        top={betweenDistance}
        style={customItemStyle}
        onClick={() => this.itemOnClick(info)}
      >
        <IconWrapper width={info.icon ? 25 : 5} style={moreStyle.IconWrapperStyle}>
          {
            info.icon && <Icon src={info.icon} alt="" style={moreStyle.IconStyle} />
          }
        </IconWrapper>
        <TextWrapper width={100}>
          {info.nameDisplay}
          <StatusPoint color={info.color} />
        </TextWrapper>
      </ItemWrapper>
    );
  }

  renderListItem() {
    const {
      height, data,
      heightOptions, width,
    } = this.props;

    return (
      <ListItemBg
        top={height}
        radius={height / 10}
        maxHeight={heightOptions}
        width={width}
      >
        {
          data.map((i, index) => this.renderItem(i, index, data.length))
        }
      </ListItemBg>
    );
  }

  render() {
    const { status } = this.state;
    const {
      width, height, color,
      customStyle, title,
      isTabIndex, moreStyle,
      isFlexColumn,
    } = this.props;
    const statusIconName = (status === STATUS.Min) ? 'iconOpenDropDown' : 'iconCloseDropDown';

    return (
      <WrapperDropdown isFlexColumn={isFlexColumn}>
        {
          title
            ? (
              <Title>
                <span>{title}</span>
              </Title>
            ) : ''
        }
        <Wrapper
          width={width}
          height={height}
          color={color}
          style={customStyle}
          tabIndex={isTabIndex && 0}
          onClick={() => this.dropdownOnClick()}
          onBlur={() => this.dropdownOnBlur()}
        >
          {this.renderCurrentItem()}
          <ButtonDown
            parentWidth={width}
            parentHeight={height}
            style={moreStyle.ButtonDownStyle}
          >
            <IconArrow src={images.iconDropDown[statusIconName]} alt="" />
          </ButtonDown>
          {
            status === STATUS.Full && this.renderListItem()
          }
        </Wrapper>
      </WrapperDropdown>
    );
  }
}

Dropdown.defaultProps = {
  index: 0,
  title: '',
  width: 10,
  height: 2,
  color: '#fff',
  customStyle: {},
  heightOptions: 0,
  customItemStyle: {},
  isFlexColumn: false,
  currentSelectedStyle: {},
  defaultSelectedId: -1,
  data: [],
  betweenDistance: 0,
  onChangeSelected: null,
  isTabIndex: true,
  moreStyle: {
    ButtonDownStyle: {},
    IconArrowStyle: {},
    IconStyle: {},
    IconWrapperStyle: {},
  },
  isDisable: false,
  ignoreWhenReselect: false,
};

Dropdown.propTypes = {
  heightOptions: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  title: PropTypes.string,
  isFlexColumn: PropTypes.bool,
  customStyle: PropTypes.objectOf(PropTypes.any),
  customItemStyle: PropTypes.objectOf(PropTypes.any),
  currentSelectedStyle: PropTypes.objectOf(PropTypes.any),
  defaultSelectedId: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.any),
  betweenDistance: PropTypes.number,
  onChangeSelected: PropTypes.func,
  moreStyle: PropTypes.objectOf(PropTypes.any),
  isDisable: PropTypes.bool,
  index: PropTypes.number,
  isTabIndex: PropTypes.bool,
  ignoreWhenReselect: PropTypes.bool,
};
