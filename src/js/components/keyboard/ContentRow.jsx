import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import BlinkPointer from './BlinkPointer';
import Images from '../../../assets/images';

const Wrapper = styled.div`
  width: 100%;
  height: ${props => props.height};
  background-color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 1.5em;
  font-weight: 700;
`;

const Blank = styled.div`
  height: ${props => props.height}em;
  width: ${props => props.width}em;
`;

const BlankFlex = styled(Blank)`
  flex: 1;
`;

const ButtonDelete = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-item: center;
  width: ${props => props.width};
  height: 100%;
`;

const ImageButtonDelete = styled.img`
  width: 80%;
  ${props => props.disabled && 'filter: grayscale(1);'}
  &: hover, active {
    filter: grayscale(${props => (props.disabled ? 100 : 70)}%);
  }
`;

const WrapperText = styled.div`
  width: fit-content;
  max-width: 85%;

`;


class ContentRow extends PureComponent {
  render() {
    const {
      height,
      textContent,
      onBackDelete,
      disableDelete,
    } = this.props;
    return (
      <Wrapper
        height={height}
      >
        <Blank width={0.5} />
        <WrapperText>
          {textContent}
          <BlinkPointer visible />
        </WrapperText>
        <BlankFlex />
        <ButtonDelete
          width="2.5em"
          onClick={() => {
            if (!disableDelete) onBackDelete();
          }}
          disabled={disableDelete}
        >
          <ImageButtonDelete src={Images.btnBackDelete} disabled={disableDelete} />
        </ButtonDelete>
      </Wrapper>
    );
  }
}

ContentRow.defaultProps = {
  onBackDelete: () => {},
  textContent: null,
};

ContentRow.propTypes = {
  height: PropTypes.any.isRequired,
  textContent: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onBackDelete: PropTypes.func,
  disableDelete: PropTypes.bool.isRequired,
};

export default ContentRow;
