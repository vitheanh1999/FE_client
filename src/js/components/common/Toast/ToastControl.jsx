import React, { Component } from 'react';
import Toast from './Toast';

class ToastControl extends Component {
  constructor(props) {
    super(props);
    ToastControl.instance = this;
    this.state = {
      listToastData: [],
    };
    this.removeToastById = this.removeToastById.bind(this);
    this.autoId = 1;
  }

  handleShowToast(content, id = null) {
    const { listToastData } = this.state;
    let idToast = id;
    if (idToast === null) {
      idToast = this.autoId;
      this.autoId += 1;
    }
    listToastData.push({
      id: idToast,
      content,
    });
    this.setState({ listToastData });
  }

  removeToastById(id) {
    const { listToastData } = this.state;
    let index = -1;
    for (let i = 0; i < listToastData.length; i += 1 ) {
      if (listToastData[i].id === id) {
        index = i;
        break;
      }
    }

    if (index >= 0) {
      listToastData.splice(index, 1);
      this.setState({ listToastData });
    }
  }

  render() {
    const { listToastData } = this.state;
    const listToast = listToastData && listToastData.map(item => (
      <Toast
        customStyle={{}}
        content={item.content}
        time={500}
        key={item.id}
        id={item.id}
        callback={this.removeToastById}
      />
    ));
    return (
      <div>
        {listToast}
      </div>
    );
  }
}

export default ToastControl;
