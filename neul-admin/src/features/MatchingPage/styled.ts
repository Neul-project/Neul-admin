import styled from "styled-components";

export const MatchingPageStyled = styled.div`
  &.matching_wrap {
    padding: 20px;
    .matching_accept_button {
      margin: 0 3px 2px 0;
    }
    .usermanage_title_box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .usermanage_search_select {
      margin-right: 3px;
      width: 130px;
    }
    .usermanage_info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
      .usermanage_sort_box {
        display: flex;
        align-items: center;
        .usermanage_order {
          width: 95px;
        }
        .usermanage_total_num {
          font-weight: 600;
          margin-right: 10px;
        }
      }
    }
    .usermanage_delete_button {
      margin-right: 3px;
    }
    tr:hover {
      cursor: pointer;
    }
  }
`;
