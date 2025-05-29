import styled from "styled-components";

export const Payliststyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

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
