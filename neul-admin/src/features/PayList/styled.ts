import styled from "styled-components";

export const Payliststyled = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;

  tr:hover {
    cursor: pointer;
  }

  .ant-table-thead > tr > th {
    text-align: center;
  }

  .ant-table-cell {
    text-align: center;
  }
`;
