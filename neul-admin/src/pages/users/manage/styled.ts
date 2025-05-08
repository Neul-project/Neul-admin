import styled from "styled-components";

export const UserManageStyled = styled.div`
  &.usermanage_wrap {
    padding: 24px;
    .usermanage_title_box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .usermanage_info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
      .usermanage_total_num {
        font-weight: 600;
        margin: 15px 0 2px 5px;
      }
    }
    .usermanage_delete_button {
      margin-left: 3px;
    }
  }
`;
