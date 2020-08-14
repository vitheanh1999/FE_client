import StorageUtils, { STORAGE_KEYS } from './StorageUtils';

export const AUTO_SAVE_KEY = {
  popupDetail: 'popupDetail',
  settingCardNoTable: 'settingCardNoTable',
};

class AutoSave {
  constructor() {
    AutoSave.instance = this;
    this.data = StorageUtils.getUserItem(STORAGE_KEYS.autoSave, {});
  }

  saveDraft(key, content) {
    this.data[key] = {
      content: JSON.parse(JSON.stringify(content)),
      time: Date().toString(),
    };
    StorageUtils.setUserItem(STORAGE_KEYS.autoSave, this.data);
  }

  getDraftContent(key) {
    if (!this.data[key]) return {};
    return this.data[key].content;
  }

  checkDraft(key) {
    const data = StorageUtils.getUserItem(STORAGE_KEYS.autoSave, {});
    if (!data[key]) return false;
    return Object.keys(data[key]).length > 0;
  }

  deleteDraft(key = null) {
    if (key == null) {
      StorageUtils.setUserItem(STORAGE_KEYS.autoSave, {});
      this.data = {};
    } else {
      this.data[key] = {};
      StorageUtils.setUserItem(STORAGE_KEYS.autoSave, this.data);
    }
  }

  deleteInstance() {
    AutoSave.instance = null;
  }
}

export default AutoSave;
