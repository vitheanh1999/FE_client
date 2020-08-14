import React from 'react';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import Dropdown,
{
  WrapperDropdown,
  ListItemBg,
  Wrapper,
  ButtonDown,
  IconArrow,
  STATUS,
  ItemWrapper,
  IconWrapper,
  Icon,
  TextWrapper,
  StatusPoint,
  CurrentItemWrapper,
} from '../common/Dropdown/Dropdown';
import { images } from '../../theme';

const CurrentItemWrapperNew = styled(CurrentItemWrapper)`
  background-color: ${props => props.bgColor || '#fff'};
  color: ${props => props.color || '#000'};
`;

const ItemWrapperNew = styled(ItemWrapper)`
  background-color: ${props => props.bgColor || '#fff'};
  color: ${props => props.color || '#000'};
  &: hover {
    background-color: ${props => props.bgColor || '#fff'};
  }
`;

class DropDownBetPattern extends Dropdown {
  renderCurrentItem() {
    const { currentSelectedId } = this.state;
    const {
      data, width, height, currentSelectedStyle, betweenDistance, moreStyle, isDisable,
    } = this.props;
    const info = data.find(item => item.id === currentSelectedId);
    if (!info) {
      return (
        <CurrentItemWrapperNew
          width={width}
          height={height}
          top={betweenDistance}
          style={currentSelectedStyle}
        />
      );
    }
    let bgColor = '#fff';
    let color = '#000';
    if (info.value === 'B') {
      bgColor = '#d4142675';
      color = '#000';
    } else if (info.value === 'P') {
      bgColor = '#007bff73';
      color = '#000';
    }
    if (isDisable) {
      bgColor = '#61636175';
    }
    return (
      <CurrentItemWrapperNew
        width={width}
        height={height}
        top={betweenDistance}
        style={currentSelectedStyle}
        bgColor={bgColor}
        color={color}
      >
        <IconWrapper width={info.icon ? 25 : 1} style={moreStyle.IconWrapperStyle}>
          {
            info.icon && <Icon src={info.icon} alt="" style={moreStyle.IconStyle} />
          }
        </IconWrapper>
        <TextWrapper width={85}>
          {info.text}
          <StatusPoint color={info.color} />
        </TextWrapper>
      </CurrentItemWrapperNew>
    );
  }

  renderItem(info, index, dataLength) {
    const {
      width, height, customItemStyle, betweenDistance, moreStyle, isDisable,
    } = this.props;
    let bgColor = '#fff';
    let color = '#000';
    if (info.value === 'B') {
      bgColor = '#d4142675';
      color = '#000';
    } else if (info.value === 'P') {
      bgColor = '#007bff73';
      color = '#000';
    }
    if (isDisable) {
      bgColor = '#61636175';
    }

    return (
      <ItemWrapperNew
        key={index}
        width={width}
        checkScroll={dataLength >= 10}
        height={height}
        top={betweenDistance}
        style={customItemStyle}
        onClick={() => this.itemOnClick(info)}
        bgColor={bgColor}
        color={color}
      >
        <IconWrapper width={info.icon ? 25 : 5} style={moreStyle.IconWrapperStyle}>
          {
            info.icon && <Icon src={info.icon} alt="" style={moreStyle.IconStyle} />
          }
        </IconWrapper>
        <TextWrapper width={100}>
          {info.text}
          <StatusPoint color={info.color} />
        </TextWrapper>
      </ItemWrapperNew>
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
        style={{ width: '100%' }}
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
      customStyle, onKeyDown,
      isTabIndex, moreStyle,
      isFlexColumn, onClick,
    } = this.props;
    const statusIconName = (status === STATUS.Min) ? 'iconOpenDropDown' : 'iconCloseDropDown';

    return (
      <WrapperDropdown
        isFlexColumn={isFlexColumn}
        style={{
          width: '100%',
          height: '100%',
        }}
        onKeyDown={onKeyDown}
      >
        <Wrapper
          width={width}
          height={height}
          color={color}
          style={customStyle}
          tabIndex={isTabIndex && 0}
          onClick={() => {
            if (isMobile) {
              onClick();
            } else {
              onClick();
              this.dropdownOnClick();
            }
          }}
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

DropDownBetPattern.defaultProps = {
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
  onClick: () => { },
  onKeyDown: () => { },
};

DropDownBetPattern.propTypes = {
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
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
};

export default DropDownBetPattern;
