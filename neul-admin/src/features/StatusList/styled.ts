import styled from "styled-components";

export const StatusListStyled = styled.div`
  &.statuslist_wrap {
    .statuslist_box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      .statuslist_delete_btn {
        margin-left: 3px;
      }
    }
    .statuslist_select {
      width: 150px;
    }
  }
`;
