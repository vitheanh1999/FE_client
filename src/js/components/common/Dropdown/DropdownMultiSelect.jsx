import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { images } from '../../../theme';
import { IconArrow, IconWrapper, Icon } from './Dropdown';
import fontSize from '../CommonStyle';

const SelectIcon = styled.div`
  width: ${props => props.width}%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NoKeySelectContent = styled.div`
  width: ${props => props.width}em;
  background-color: #fff;
  border-radius: 1px solid #aeaeae;
  height: ${props => props.height}em;
  color: #000;
  border-right: none;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  background-color: #fff;
  width: 12.8125em;
  margin-right: 18%;
  border: 1px solid #aeaeae;
  border-right: none;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RatioRadius = 0.06667;

const Wrapper = styled.div`
  display: flex;
  width: ${props => props.width}em;
  min-height: ${props => props.height}em;
  background-color: ${props => props.color};
  justify-content: center;
  align-items: center;
  border-radius: ${props => (Math.min(props.width, props.height) * RatioRadius)}px;
  position: relative;
`;

const ButtonDown = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;
  border: 1px solid #aeaeae;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  border-left: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18%;
  cursor: pointer;
  ${props => (Math.min(props.parentWidth, props.parentHeight) * RatioRadius)}px 0;

  &: hover {
    background: #2d889c;
  }
`;

const STATUS = {
  Full: 1,
  Min: 2,
};

const ListItemBg = styled.div`
  display: flex;
  flex-direction: column;
  width: ${props => props.width}em;
  max-height: ${props => props.height}em;
  min-height: fit-content;
  color: #000;
  position: absolute;
  top: ${props => props.top}px;
  background: #fff;
  border-left: 1px solid #aeaeae;
  border-right: 1px solid #aeaeae;
  border-top: 1px solid #aeaeae;
  border-radius: 0 0 ${props => props.radius}px ${props => props.radius}px;
`;

const ItemWrapper = styled.div`
  width: ${props => props.width}em;
  height: ${props => props.height}em;
  margin-top: ${props => props.top}px;
  display: flex;
  flex-direction: row;
  border-width: 0 0 ${props => props.height / 50}px; 0;
  border-color: #aeaeae;
  border-style: solid;
  font-size: ${props => props.fontSize}px;

  &: hover {
    background-color: rgba(45, 136, 156, 0.8);
  }
`;

const CurrentItemWrapper = styled.div`
  position: relative;
  background-color: #FFF;
  color: #000;
  height: ${props => props.height}em;
  width: 33%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.fontSize}px;
  margin: 0 0.5em;
`;

const TextWrapper = styled.div`
  width: ${props => props.width}%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
`;

export default class DropdownMultiSelect extends Component {
  constructor(props) {
    super(props);
    const { data } = this.props;
    this.state = {
      status: STATUS.Min,
      listOptions: [...data],
    };
    this.elementHeight = 0;
  }

  componentDidMount() {
  }

  componentDidUpdate() {
    const height = document.getElementById('list-current-key').clientHeight;
    if (this.elementHeight !== height) {
      this.elementHeight = height;
      this.forceUpdate();
    }
  }

  dropdownOnClick() {
    const { status } = this.state;
    if (status === STATUS.Full) this.setState({ status: STATUS.Min });
    else this.setState({ status: STATUS.Full });
  }

  itemOnClick(info) {
    const { onChangeSelected } = this.props;
    if (onChangeSelected) onChangeSelected(info.id);
  }

  renderCurrentItem() {
    const {
      data, height, currentSelectedStyle, listSelectedKeyId, width,
    } = this.props;
    const info = data.filter(item => listSelectedKeyId.includes(item.id));
    if (info.length === 0) {
      return (
        <NoKeySelectContent
          height={height}
          width={width}
        >
          Please choose a key
        </NoKeySelectContent>
      );
    }
    return info.map(item => (
      <CurrentItemWrapper
        key={item.id}
        height={height}
        style={currentSelectedStyle}
        fontSize={fontSize}
      >
        <TextWrapper width={60}>
          {item.text}
        </TextWrapper>
      </CurrentItemWrapper>
    ));
  }

  renderItem(info, index) {
    const {
      width, height, customItemStyle, listSelectedKeyId,
    } = this.props;
    return (
      <ItemWrapper
        key={index}
        width={width}
        height={height}
        style={customItemStyle}
        onClick={() => this.itemOnClick(info)}
        fontSize={fontSize}
      >
        <SelectIcon width={20}>
          {listSelectedKeyId.includes(info.id) ? (
            <Icon src={images.iconDropDown.checkedBox} alt="" />
          ) : (
            <Icon src={images.iconDropDown.uncheckBox} alt="" />
          )}
        </SelectIcon>
        <IconWrapper width={20}>
          {
            info.icon && <Icon src={info.icon} alt="" />
          }
        </IconWrapper>
        <TextWrapper width={60}>
          {info.text}
        </TextWrapper>
      </ItemWrapper>
    );
  }

  renderListItem() {
    const {
      width, height, data,
    } = this.props;

    const { listOptions } = this.state;

    let totalHeight = data.length * height;
    if (data.length >= 1) totalHeight += data.length;

    return (
      <ListItemBg
        width={width}
        height={totalHeight}
        top={this.elementHeight}
        radius={height / 10}
      >
        {
          listOptions.map((i, index) => this.renderItem(i, index))
        }
      </ListItemBg>
    );
  }

  render() {
    const { status } = this.state;
    const {
      width, height, color, customStyle,
    } = this.props;

    return (
      <Wrapper
        width={width}
        height={height}
        color={color}
        style={customStyle}
        fontSize={fontSize}
      >
        <Content id="list-current-key">
          {this.renderCurrentItem()}
        </Content>
        <ButtonDown
          parentWidth={width}
          parentHeight={height}
          onClick={() => this.dropdownOnClick()}
        >
          <IconArrow status={status === STATUS.Min} src={images.iconDropDown.iconCloseDropDown} alt="" />
        </ButtonDown>
        {
          status === STATUS.Full && this.renderListItem()
        }
      </Wrapper>
    );
  }
}

DropdownMultiSelect.defaultProps = {
  width: 15.625,
  height: 3.125,
  color: 'white',
  customStyle: {},
  customItemStyle: {},
  currentSelectedStyle: {},
  data: [
    { id: -1, icon: 'https://luc888-api-img-test.s3.ap-southeast-1.amazonaws.com/images/1558932565gem1.png', text: 'value1' },
    { id: 1, icon: 'https://luc888-api-public-resource.s3.ap-southeast-1.amazonaws.com/images/1564585836gc.png', text: 'value2' },
    { id: 2, icon: 'https://luc888-api-img-test.s3.ap-southeast-1.amazonaws.com/images/15592728321559031092images.png', text: 'value3' },
  ],
  onChangeSelected: () => { },
};

DropdownMultiSelect.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  color: PropTypes.string,
  customStyle: PropTypes.objectOf(PropTypes.any),
  customItemStyle: PropTypes.objectOf(PropTypes.any),
  currentSelectedStyle: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  onChangeSelected: PropTypes.func,
  listSelectedKeyId: PropTypes.arrayOf(PropTypes.any).isRequired,
};
