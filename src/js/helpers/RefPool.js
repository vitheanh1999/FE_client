import React from 'react';

class RefPool {
  constructor() {
    this.pool = {};
  }

  getLength() {
    return Object.keys(this.pool).length;
  }

  addRef(id) {
    const keyName = `${id}`;
    const keys = Object.keys(this.pool);
    if (keys.includes(keyName)) {
      return this.pool[keyName];
    }
    this.pool[keyName] = React.createRef();
    return this.pool[keyName];
  }

  getRef(id) {
    const keyName = `${id}`;
    const keys = Object.keys(this.pool);
    if (keys.includes(keyName)) {
      return this.pool[keyName];
    }
    return null;
  }

  removeRef(id) {
    const keyName = `${id}`;
    delete this.pool[keyName];
  }

  getOrCreatRef(id) {
    return this.addRef(id);
  }
}

export default RefPool;
