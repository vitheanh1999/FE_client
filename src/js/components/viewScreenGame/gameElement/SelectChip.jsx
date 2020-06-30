import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import images from '../../../../assets/lucImage';
import CheckButtonImage from '../gameCommon/CheckButtonImage';
import ButtonImage from '../gameCommon/ButtonImage';
import { getImageChip } from './gameCoin/Coin';
import { CHIP_VALUES } from '../logicCore/animationHelp';

export const StyledSelectedChip = styled.div`
  display: flex;
  flex-direction: row;
  width: 295px;
`;

export const DarkBackground = styled.div`
  position: absolute;
  top: -320px;
  left: 0;
  right: 0;
  bottom: -360px;
  background: rgba(0, 0, 0, 0.5);
  pointer-events: auto;
`;

export const BackgroundPopup = styled.div`
  position: absolute;
  top: 85px;
  left: 560px;
  width: 431px;
  height: 311px;
  background-image: url(${images.selectChipBg});
  display: flex;
  flex-direction: column;
`;

export const ButtonX = styled.div`
  height: 13px;
  width: 13px;
  right: 20px;
  top: 20px;
  cursor: pointer;
  position: absolute;
  user-select: none;
  background-image: url(${images.iconX});
`;

export const Title = styled.div`
  text-align: left;
  padding-left: 33px;
  margin-bottom: 10px;
  color: white;
  font-size: 17px;
  user-select: none;
`;

export const TitleWrapper = styled.div`
  height: 55px;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
`;

export const SelectChipWrapper = styled.div`
  height: 182px;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

export const UL = styled.ul`
  width: 339px;
  height: 152px;
  padding-inline-start: 0;
`;

export const Li = styled.li`
  float: left;
  width: 111px;
  height: 50px;
  justify-content: center;
  align-items: center;
  display: flex;
`;

export const ResultChipWrapper = styled.div`
  height: 72px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  padding-left: 16px;
`;

export const Triangle = styled.div`
  width: 0;
  height: 0;
  bottom: 64px;
  margin-left: ${props => props.marginLeft}px;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 10px solid #b69b67;
  position: absolute;
`;

export const compare = (a, b) => {
  if (a.value < b.value) { return -1; }
  if (a.value > b.value) { return 1; }
  return 0;
};

export const checkSelectedFull = (selectedChips) => {
  let count = 0;
  for (let i = 0; i < selectedChips.length; i += 1) {
    if (selectedChips[i].value > 0) count += 1;
  }
  return (count > 1);
};

class SelectChip extends Component {
  constructor(props) {
    super(props);
    const { currentListChipValue } = this.props;
    const listChipValue = [...CHIP_VALUES];
    const listChipImage = [
      images.chip100,
      images.chip500,
      images.chip1k,
      images.chip5k,
      images.chip10k,
      images.chip25k,
      images.chip50k,
      images.chip100K,
      images.chip500K,
    ];

    const selectChips = [];
    for (let i = 0; i < 12; i += 1) {
      selectChips.push({
        value: listChipValue[i],
        isSelected: currentListChipValue.includes(listChipValue[i]),
        img: listChipImage[i],
      });
    }

    const selectedChips = [];
    for (let i = 0; i < currentListChipValue.length; i += 1) {
      selectedChips.push({
        value: currentListChipValue[i],
        img: getImageChip(currentListChipValue[i]),
      });
    }
    this.state = {
      selectChips,
      selectedChips,
      enableSave: true,
      sortable: false,
    };

    this.save = this.save.bind(this);
    this.sort = this.sort.bind(this);
  }

  componentDidMount() {
  }

  onClickSelectChip(index) {
    const { selectChips } = this.state;
    const selected = selectChips[index].isSelected;

    if (selected === true) {
      this.unSelectChip(index);
    } else {
      this.selectChip(index);
    }
  }

  onClickSelectedChip(index) {
    const { selectChips, selectedChips } = this.state;
    let findIndex = -1;
    for (let i = 0; i < 12; i += 1) {
      if (selectedChips[index].value === selectChips[i].value) {
        findIndex = i;
        break;
      }
    }
    this.onClickSelectChip(findIndex);
  }

  unSelectChip(index) {
    const { selectChips, selectedChips } = this.state;
    const findIndex = selectedChips.findIndex(item => item.value === selectChips[index].value);
    if (findIndex >= 0) selectedChips.splice(findIndex, 1);
    selectChips[index].isSelected = false;

    this.setState({ selectChips, selectedChips, enableSave: checkSelectedFull(selectedChips) });
  }

  selectChip(index) {
    const { selectChips, selectedChips } = this.state;

    if (selectedChips.length < 5) {
      selectedChips.push(selectChips[index]);
      selectChips[index].isSelected = true;
    }

    this.setState({
      selectChips,
      selectedChips,
      enableSave: checkSelectedFull(selectedChips),
      sortable: false,
    });
  }

  save() {
    const { onSave } = this.props;
    const { selectedChips, enableSave } = this.state;
    if (enableSave === false) return;
    const result = [];
    for (let i = 0; i < selectedChips.length; i += 1) {
      result.push(selectedChips[i].value);
    }
    onSave(result);
  }

  sort() {
    const { selectedChips, sortable } = this.state;
    selectedChips.sort(compare);
    if (sortable) {
      selectedChips.reverse();
    }
    this.setState({
      selectedChips,
      sortable: !sortable,
    });
  }

  renderListChip() {
    const { selectChips } = this.state;
    const lsChipItem = [];
    for (let i = 0; i < CHIP_VALUES.length; i += 1) {
      const item = (
        <Li key={`${i}`}>
          <CheckButtonImage
            width={45}
            height={45}
            isChecked={selectChips[i].isSelected}
            onClick={() => this.onClickSelectChip(i)}
            imgNormal={selectChips[i].img}
            imgSelected={images.grayChip}
          />
        </Li>
      );
      lsChipItem.push(item);
    }
    return lsChipItem;
  }

  renderSelectedChips() {
    const lsChip = [];
    const { selectedChips } = this.state;
    for (let i = 0; i < selectedChips.length; i += 1) {
      if (selectedChips[i].value > 0) {
        lsChip.push(
          <CheckButtonImage
            width={48}
            height={48}
            isChecked={false}
            onClick={() => this.onClickSelectedChip(i)}
            imgNormal={selectedChips[i].img}
            imgSelected={images.grayChip}
            customStyle={{
              marginLeft: 11,
              marginBottom: 6,
            }}
            key={`${i}`}
          />,
        );
      }
    }
    return lsChip;
  }

  render() {
    const { onClose } = this.props;
    const { enableSave, sortable, selectedChips } = this.state;
    const sortImg = sortable ? images.sortAsc : images.sortDesc;
    return (
      <DarkBackground>
        <BackgroundPopup>
          <ButtonX onClick={onClose} />
          <TitleWrapper>
            <Title>Set Chip</Title>
          </TitleWrapper>
          <SelectChipWrapper>
            <UL>
              {
                this.renderListChip()
              }
            </UL>
          </SelectChipWrapper>
          {selectedChips.length !== 5 && <Triangle marginLeft={45 + selectedChips.length * 59} />}
          <ResultChipWrapper>
            <StyledSelectedChip>
              {this.renderSelectedChips()}
            </StyledSelectedChip>
            <div>
              <ButtonImage
                enable
                onClick={this.sort}
                imgNormal={sortImg}
                imgSelected={sortImg}
                imgDisable={sortImg}
                width={79}
                height={24}
                customStyle={{
                  marginBottom: 12,
                }}
              />
              <ButtonImage
                enable={enableSave}
                onClick={this.save}
                imgNormal={images.btnOkSelected}
                imgSelected={images.btnOK}
                imgDisable={images.btnOK}
                left={10}
                width={85}
                height={24}
                customStyle={{
                  marginBottom: 4,
                }}
              />
            </div>
          </ResultChipWrapper>
        </BackgroundPopup>
      </DarkBackground>
    );
  }
}

SelectChip.propTypes = {
  onClose: PropTypes.func.isRequired,
  currentListChipValue: PropTypes.arrayOf(PropTypes.number).isRequired,
  onSave: PropTypes.func.isRequired,
};

SelectChip.defaultProps = {
};

export default SelectChip;
