import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../actions/betting/history';
import SuperGameHistory from './SuperGameHistory';

class GameHistory extends SuperGameHistory {
}

GameHistory.propTypes = {
  fetchData: PropTypes.func.isRequired,
  toggleHistory: PropTypes.func.isRequired,
  isShowHistory: PropTypes.bool.isRequired,
  tableId: PropTypes.number.isRequired,
  chipCategory: PropTypes.arrayOf(PropTypes.any).isRequired,
};

const mapStateToProps = state => ({
  isShowHistory: state.history.isShow,
  chipCategory: state.chipCategory.chipCategory,
});

const mapDispatchToProps = dispatch => ({
  fetchData: bindActionCreators(actions.fetchData, dispatch),
  toggleHistory: bindActionCreators(actions.toggleHistory, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(GameHistory);
