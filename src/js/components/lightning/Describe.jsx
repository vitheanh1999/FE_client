import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { images } from '../../theme';
import LightningBody from './LightningBody';


const WrapperDescribe = styled.div`
  width: 100%;
  position: absolute;
  top: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContentDescribe = styled.div`
  // display: flex;
  //justify-content: center;
  margin-top: 1.2em;
  width: 90%;
`;

const ElementDescribe = styled.div`
  margin-top: 3em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImgDescribe = styled.img`
  width: 100%;
  max-width: 1200px;
  align-self: center;
`;

const ImgDescribeContent = styled.img`
  width: 100%;
  border-radius: 1.2em;
  max-width: 1080px;
`;

class Describe extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const lengthContent = Object.keys(images.describe).length / 2;
    const contentDescribe = [];
    for (let i = 1; i < lengthContent + 1; i += 1) {
      const contentFieldName = 'describe'.concat(i);
      const titleFieldName = 'describeTitle'.concat(i);

      contentDescribe.push((
        <ElementDescribe key={i}>
          <ImgDescribe src={images.describe[titleFieldName]} />
          <ContentDescribe>
            <ImgDescribeContent src={images.describe[contentFieldName]} />
          </ContentDescribe>
        </ElementDescribe>
      ));
    }

    return (
      <WrapperDescribe>
        {contentDescribe}
        <LightningBody
          locationBottom
          onChangePageType={this.props.onChangePageType}
        />
        <ImgDescribe src={images.noteRed} width={100} />
      </WrapperDescribe>
    );
  }
}

Describe.propTypes = {
  onChangePageType: PropTypes.func.isRequired,
};

export default Describe;
