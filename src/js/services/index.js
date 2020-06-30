import { api } from '../helpers/api';

export function getDetailUser() {
  return api.get('user');
}

export function getNextBet(turnId) {
  return api.get(`next-bet?turn_id=${turnId}`);
}

export function getBetHistory(perPage, currentPage) {
  return api.get(`history?per_page=${perPage}&current_page=${currentPage}`);
}
