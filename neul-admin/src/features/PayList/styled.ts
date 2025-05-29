import styled from "styled-components";

export const Payliststyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  .paylist_box {
    display: flex;
    align-items: center;
    .paylist_popover {
      margin-left: 5px;
    }
  }

  .ant-table-wrapper .ant-table-pagination-right {
    justify-content: center;
  }

  .ant-table-thead > tr > th {
    text-align: center;
  }

  .ant-table-cell {
    text-align: center;
  }
`;
