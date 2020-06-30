import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import { Wrapper, ContainerTable } from '../gameTable/GameTable';
import { LoadingAnimation } from './LayoutVideo';

export const ContainerBoard = styled(ContainerTable)``;

export const WrapperBoard = styled(Wrapper)`
  height: ${props => (props.isOff ? 'unset' : `${props.scale * 414}px`)};
`;

export const WrapperNotice = styled.div`
  position: absolute;
  top: 2.6em;
  right: 0.5em;
  color: red;
  font-size: ${props => props.scale * 0.9}em;
  font-weight: 600;
`;

export const Blank = styled.div`
  width: 100%;
  height: ${props => props.scale * 65}px;
`;

export const Board = styled.div`
  width: 100%;
  background-color: rgb(108, 108, 108);
  flex: 1;
  padding: ${props => props.scale * 5}px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  font-family: Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif;
`;

export const BoardHeader = styled.div`
  width: 100%;
  height: ${props => props.scale * 38}px;
  background-color: rgb(51, 51, 51);
  border-bottom-width: ${props => props.scale * 1}px;
  border-bottom-style: solid;
  border-bottom-color: rgb(102, 102, 102);
  display: flex;
  flex-direction: row;
`;

export const TableTitle = styled.div`
  width: ${props => props.scale * props.width}px;
  height: 100%;
  font-size: ${props => props.scale * 16}px;
  color: white;
  font-weight: 700;
  border-right-width: ${props => props.scale * 1}px;
  border-right-color: rgb(102, 102, 102);
  border-right-style: solid;
  align-items: center;
  display: flex;
  justify-content: ${props => props.justifyContent || 'center'};
  box-sizing: border-box;
`;

export const TableTitleEnd = styled(TableTitle)`
  width: unset;
  flex: 1;
  border-right-width: 0;
`;

export const TableContent = styled.div`
  width: 100%;
  overflow: auto;
  overflow-x: hidden;
  height: ${props => props.scale * (props.isOff ? 506 : 282)}px;
`;

export const BoardRow = styled.div`
  width: 100%;
  min-height: ${props => props.scale * 28}px;
  background-color: ${props => ((props.index % 2 === 0) ? 'rgb(85, 85, 85)' : 'rgb(68, 68, 68)')};
  border-bottom-width: ${props => props.scale * 1}px;
  border-bottom-style: solid;
  border-bottom-color: rgb(102, 102, 102);
  border-top-width: ${props => props.scale * 1}px;
  border-top-style: solid;
  border-top-color: rgb(102, 102, 102);
  display: flex;
  flex-direction: row;
  box-sizing: border-box;
`;

export const RowField = styled.div`
  width: ${props => props.scale * props.width}px;
  font-size: ${props => props.scale * 13}px;
  color: white;
  border-right-width: ${props => props.scale * 1}px;
  border-right-color: rgb(102, 102, 102);
  border-right-style: solid;
  display: flex;
  justify-content: ${props => props.align};
  box-sizing: border-box;
  align-items: center;
  overflow: hidden;
  text-align: right;
  word-break: break-word;
  padding-left: ${props => props.paddingLeft || 0}px;
`;

export const LoadingNewTurn = styled(RowField)`
  width: 100%;
`;

export const SpinnerCustom = styled(Spinner)`
  margin: 0 1em;
  height: 1.5em;
  width: 1.5em;
`;

export const RowFieldRight = styled(RowField)`
  padding-right: ${props => props.scale * 10}px;
  padding-left: ${props => props.scale * 10}px;
`;

export const RowFieldRightEnd = styled(RowField)`
  width: unset;
  flex: 1;
  border-right-width: 0;
  padding-right: ${props => props.scale * 15}px;
`;

export const Span = styled.span`
  display: flex;
  align-items: baseline;
  white-space: pre-wrap;
`;

// export const FAKE_DATA = [
//   {
//     turn_id: 56180,
//     after_betting: 999800,
//     chip_category_id: 2,
//     time: '2019-07-24 10:51:37',
//     table: { name: 'C003', sub_name: null, type: 'Basic' },
//     result: { banker: 0, player: 4 },
//     select: {
//       p_pair: 0, b_pair: 0, tie: 0, banker: 0, player: 200,
//     },
//     payoff: 200,
//   },
//   {
//     turn_id: 56180,
//     after_betting: 95900,
//     chip_category_id: 1,
//     time: '2019-07-24 10:51:37',
//     table: {
//       name: 'C003',
//       sub_name: null,
//       type: 'Basic',
//     },
//     result: {
//       banker: 0,
//       player: 4,
//     },
//     select: {
//       p_pair: 0,
//       b_pair: 0,
//       tie: 0,
//       banker: 0,
//       player: 200,
//     },
//     payoff: 200,
//   },
//   {
//     turn_id: 56136,
//     after_betting: 999600,
//     chip_category_id: 2,
//     time: '2019-07-23 16:23:36',
//     table: {
//       name: 'C003',
//       sub_name: null,
//       type: 'Basic',
//     },
//     result: {
//       banker: 6,
//       player: 3,
//     },
//     select: {
//       p_pair: 0,
//       b_pair: 0,
//       tie: 0,
//       banker: 0,
//       player: 400,
//     },
//     payoff: -400,
//   },
//   {
//     turn_id: 56136,
//     after_betting: 95700,
//     chip_category_id: 1,
//     time: '2019-07-23 16:23:36',
//     table: {
//       name: 'C003',
//       sub_name: null,
//       type: 'Basic',
//     },
//     result: {
//       banker: 6,
//       player: 3,
//     },
//     select: {
//       p_pair: 0,
//       b_pair: 0,
//       tie: 0,
//       banker: 0,
//       player: 400,
//     },
//     payoff: -400,
//   },
//   {
//     turn_id: 52625,
//     after_betting: 422,
//     chip_category_id: 10,
//     time: '2019-07-01 15:01:34',
//     table: {
//       name: 'C003',
//       sub_name: null,
//       type: 'Basic',
//     },
//     result: {
//       banker: 4,
//       player: 2,
//     },
//     select: {
//       p_pair: 0,
//       b_pair: 0,
//       tie: 0,
//       banker: 0,
//       player: 200,
//     },
//     payoff: -200,
//   },
//   {
//     turn_id: 52624,
//     after_betting: 622,
//     chip_category_id: 10,
//     time: '2019-07-01 15:00:33',
//     table: {
//       name: 'C003',
//       sub_name: null,
//       type: 'Basic',
//     },
//     result: {
//       banker: 5,
//       player: 1,
//     },
//     select: {
//       p_pair: 0,
//       b_pair: 0,
//       tie: 0,
//       banker: 0,
//       player: 300,
//     },
//     payoff: -300,
//   },
//   {
//     turn_id: 52624,
//     after_betting: 622,
//     chip_category_id: 10,
//     time: '2019-07-01 15:00:33',
//     table: {
//       name: 'C003',
//       sub_name: null,
//       type: 'Basic',
//     },
//     result: {
//       banker: 5,
//       player: 1,
//     },
//     select: {
//       p_pair: 0,
//       b_pair: 100,
//       tie: 0,
//       banker: 0,
//       player: 0,
//     },
//     payoff: -100,
//   },
//   {
//     turn_id: 47989,
//     after_betting: 96000,
//     chip_category_id: 1,
//     time: '2019-06-13 09:36:20',
//     table: {
//       name: 'C001',
//       sub_name: null,
//       type: 'Basic',
//     },
//     result: {
//       banker: 9,
//       player: 6,
//     },
//     select: {
//       p_pair: 0,
//       b_pair: 0,
//       tie: 0,
//       banker: 0,
//       player: 300,
//     },
//     payoff: -300,
//   },
//   {
//     turn_id: 47988,
//     after_betting: 96300,
//     chip_category_id: 1,
//     time: '2019-06-13 09:35:22',
//     table: {
//       name: 'C001',
//       sub_name: null,
//       type: 'Basic',
//     },
//     result: {
//       banker: 3,
//       player: 9,
//     },
//     select: {
//       p_pair: 0,
//       b_pair: 0,
//       tie: 0,
//       banker: 0,
//       player: 300,
//     },
//     payoff: 300,
//   },
//   {
//     turn_id: 47360,
//     after_betting: 96000,
//     chip_category_id: 1,
//     time: '2019-06-11 10:05:34',
//     table: {
//       name: 'C003',
//       sub_name: null,
//       type: 'Basic',
//     },
//     result: {
//       banker: 5,
//       player: 8,
//     },
//     select: {
//       p_pair: 0,
//       b_pair: 0,
//       tie: 0,
//       banker: 0,
//       player: 900,
//     },
//     payoff: 900,
//   },
//   {
//     turn_id: 47360,
//     after_betting: 96000,
//     chip_category_id: 1,
//     time: '2019-06-11 10:05:34',
//     table: {
//       name: 'C003',
//       sub_name: null,
//       type: 'Basic',
//     },
//     result: {
//       banker: 5,
//       player: 8,
//     },
//     select: {
//       p_pair: 0,
//       b_pair: 0,
//       tie: 400,
//       banker: 0,
//       player: 0,
//     },
//     payoff: -400,
//   },
//   {
//     turn_id: 46977,
//     after_betting: 95500,
//     chip_category_id: 1,
//     time: '2019-06-10 15:47:40',
//     table: {
//       name: 'C002',
//       sub_name: null,
//       type: 'Basic',
//     },
//     result: {
//       banker: 7,
//       player: 4,
//     },
//     select: {
//       p_pair: 0,
//       b_pair: 0,
//       tie: 0,
//       banker: 0,
//       player: 400,
//     },
//     payoff: -400,
//   },
// ];

export const convertData = (dataItem) => {
  const payoff = parseInt(dataItem.payoff, 10);
  const isPlayerWin = parseInt(dataItem.player, 10) > parseInt(dataItem.banker, 10);
  let isSelectBanker = true;
  if (isPlayerWin === true) {
    isSelectBanker = payoff > 0;
  } else {
    isSelectBanker = payoff <= 0;
  }
  const betValue = dataItem.banker || dataItem.player;
  return {
    turn_id: parseInt(dataItem.turn_id, 10),
    after_betting: 96000,
    chip_category_id: 1,
    time: '2019-06-11 10:05:34',
    table: {
      name: 'C001',
      sub_name: null,
      type: 'Basic',
    },
    result: {
      banker: parseInt(dataItem.banker, 10),
      player: parseInt(dataItem.player, 10),
    },
    select: {
      p_pair: 0,
      b_pair: 0,
      tie: 0,
      banker: isSelectBanker ? 0 : betValue,
      player: isSelectBanker ? betValue : 0,
    },
    payoff,
  };
};

export const LoadingContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
`;

export const CustomLoadingAnimation = styled(LoadingAnimation)`
  top: ${props => props.scale * (props.isOff ? 80 : 30)}px;
  left: ${props => props.scale * (props.isOff ? 500 : 280)}px;
`;
