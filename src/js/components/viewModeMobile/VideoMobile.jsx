import React, { Component } from 'react';
import {
  WrapperVideo, BoxVideo,
} from './videoMobileStyle';

const getRealSize = () => {
  const maxWidth = window.innerWidth;
  const maxHeight = window.innerHeight * 0.39893;
  const ratio = maxWidth / maxHeight;
  if (ratio >= 1.541) {
    return { width: maxHeight * 1.541, height: maxHeight };
  }
  return { width: maxWidth, height: maxWidth / 1.541 };
};

class VideoMobile extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const size = getRealSize();
    console.log('size = ', size);
    return (
      <WrapperVideo height={size.height}>
        <BoxVideo width={size.width} height={size.height} />
      </WrapperVideo>
    );
  }
}

VideoMobile.propTypes = {
  // closeViewMode: PropTypes.func,
  // botInfo: PropTypes.objectOf(PropTypes.any),
};

VideoMobile.defaultProps = {
  // closeViewMode: null,
  // botInfo: null,
};
export default VideoMobile;
