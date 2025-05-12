import styled from "styled-components";

export const UserManageStyled = styled.div`
  &.usermanage_wrap {
    padding: 24px;
    .usermanage_title_box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .usermanage_search_select {
      margin-right: 3px;
    }
    .usermanage_info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
      .usermanage_sort_box {
        display: flex;
        align-items: center;
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
