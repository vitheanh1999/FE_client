import dayjs from 'dayjs';
import StorageUtils, { STORAGE_KEYS } from './StorageUtils';

const MAX_SAVE = 150;

export default class NewsHelper {
  constructor() {
    NewsHelper.instance = this;
    // this.listReadId : all new has read in 7 day
    // this.listUnreadId : all new unread in 7 day
    this.init();
  }

  static getInstance() {
    if (!NewsHelper.instance) {
      NewsHelper.instance = new NewsHelper();
    }
    return NewsHelper.instance;
  }

  init() {
    const dataLocal = StorageUtils.getUserItem(STORAGE_KEYS.newsRead, {});
    if (dataLocal && dataLocal.listReadId) {
      this.listReadId = dataLocal.listReadId;
    } else {
      this.listReadId = [];
    }
    if (dataLocal && dataLocal.listReadTopId) {
      this.listReadTopId = dataLocal.listReadTopId;
    } else {
      this.listReadTopId = [];
    }
    this.listUnreadId = [];
    this.listUnreadTopId = [];
  }

  addNewReadId(newId, startPlan, listReadId, listUnreadId) {
    if (!listReadId) this.init();
    const now = dayjs();
    const minDay = now.add(-7, 'day');
    if (dayjs(startPlan).isBefore(minDay)) {
      const index = listReadId.indexOf(newId);
      if (index > -1) {
        listReadId.splice(index, 1);
      }
      return;
    }

    if (listReadId.includes(newId) === true) return;
    if (listReadId.length >= MAX_SAVE) listReadId.splice(0, 1);
    listReadId.push(newId);
    this.removeFromListUnread(newId, listUnreadId);
    this.save();
  }

  addNewDashboardReadId(newId, startPlan) {
    this.addNewReadId(newId, startPlan, this.listReadId, this.listUnreadId);
    this.addNewReadId(newId, startPlan, this.listReadTopId, this.listUnreadTopId);
  }

  addNewTopReadId(newId, startPlan) {
    this.addNewReadId(newId, startPlan, this.listReadTopId, this.listUnreadTopId);
  }

  addNewUnreadId(newId, listUnreadId) {
    const index = listUnreadId.indexOf(newId);
    if (index === -1) {
      if (listUnreadId.length >= MAX_SAVE) listUnreadId.splice(0, 1);
      listUnreadId.push(newId);
    }
  }

  removeFromListUnread(newId, listUnreadId) {
    const index = listUnreadId.indexOf(newId);
    if (index > -1) {
      listUnreadId.splice(index, 1);
    }
  }

  save() {
    if (!this.listReadId || !this.listReadTopId) this.init();
    StorageUtils.setUserItem(STORAGE_KEYS.newsRead, {
      listReadId: this.listReadId,
      listUnreadId: this.listUnreadId,
      listReadTopId: this.listReadTopId,
      listUnreadTopId: this.listUnreadTopId,
    });
  }

  checkHasRead(newId, startPlan, listReadId, listUnreadId) {
    if (!listReadId) this.init();
    const now = dayjs();
    const minDay = now.add(-7, 'day');
    if (dayjs(startPlan).isBefore(minDay)) {
      this.removeFromListUnread(newId, listUnreadId);
      return true;
    }

    const result = listReadId.includes(newId);
    if (result === false) this.addNewUnreadId(newId, listUnreadId);
    return result;
  }

  checkHasReadTop(newId, startPlan) {
    return this.checkHasRead(newId, startPlan, this.listReadTopId, this.listUnreadTopId);
  }

  checkHasReadDashboard(newId, startPlan) {
    return this.checkHasRead(newId, startPlan, this.listReadId, this.listUnreadId);
  }

  checkAllNewHasRead() {
    if (!this.listReadId) this.init();
    return (this.listUnreadId.length > 0);
  }
}
