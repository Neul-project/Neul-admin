import styled from "styled-components";

export const MatchingPageStyled = styled.div`
  &.matching_wrap {
    padding: 20px;

    .ant-table-wrapper .ant-table-pagination-right {
      justify-content: center;
    }

    /* 테이블 가운데 정렬 */
    .ant-table-thead > tr > th {
      text-align: center;
    }
    .ant-table-cell {
      text-align: center;
    }

    .matching_accept_button {
      margin: 0 3px 2px 0;
    }
    .matching_title_box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .matching_search_select {
      margin-right: 3px;
      width: 130px;
    }
    .matching_info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .matching_sort_box {
        display: flex;
        align-items: center;
        .matching_order {
          width: 95px;
        }
        .matching_total_num {
          font-weight: 600;
          margin-right: 10px;
        }
      }
    }
    .matching_delete_button {
      margin-right: 3px;
    }
    tr:hover {
      cursor: pointer;
    }
  }
`;
