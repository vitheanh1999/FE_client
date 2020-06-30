import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const TableWrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 5px;
  width: 289px;
  position: relative;
  flex-direction: column;
`;

const TypeTable = styled.div`
  color: #fff;
  z-index: 1;
  font-size: 14px;
  font-weight: 600;
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

const ImageChip = styled.img`
  height: 14px;
  margin-left: 5px;
`;

class TableList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };

    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentDidMount() {
    this.setLoading(true);
  }

  onSuccess() {
    this.setLoading(false);
  }

  onError() {
    this.setLoading(false);
  }

  setLoading(value) {
    this.setState({ loading: value });
  }

  render() {
    const {
      allTableData,
    } = this.props;
    const tableList = allTableData.listTable;
    const listTable = tableList !== undefined && tableList.length > 0 ? tableList.map(item => (
      <TableWrap key={`${item.name}${item.type.name}`}>
        <TypeTable>
          <div>{`${item.name} ${item.type.name}`}</div>
          <div>
            {
              item.list_chip.map(chip => (
                <ImageChip src={chip.icon} key={chip.id} />
              ))
            }
          </div>
        </TypeTable>
      </TableWrap>
    )) : [];
    return (
      <div>
        {listTable}
      </div>
    );
  }
}
TableList.propTypes = {
  allTableData: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

TableList.defaultProps = {
};


export default TableList;
