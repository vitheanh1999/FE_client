import React, { Component } from 'react';
import { SearchWrapper, InputText } from '../../containers/debugLogs/showDebugLogsStyle';
import { images } from '../../theme';
import { ImageClose } from '../../containers/debugLogs/showDebugLogsStyle';

class SearchLog extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const {
      handleSearch, valueInput, clearValue, clearInputStatus,
    } = this.props;
    return (
      <SearchWrapper>
        <InputText
          value={valueInput}
          onChange={event => handleSearch(event.target.value)}
        />
        {
          clearInputStatus && (
          <ImageClose
            src={images.offStatus}
            onClick={() => clearValue()}
          />
          )
        }
      </SearchWrapper>
    );
  }
}

export default SearchLog;
