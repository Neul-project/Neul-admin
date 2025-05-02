import styled from "styled-components";

export const ActivityListStyled = styled.div`
  &.ActivityList_main_wrap {
    .ActivitiyList_status {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;

      .ActivityList_UserSelect {
        display: flex;
        gap: 15px;
        align-items: center;

        .ActivityList_select {
          width: 150px;
        }
      }
      .ActivityList_btns {
        display: flex;
        gap: 10px;
      }
    }
  }
`;
