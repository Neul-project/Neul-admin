import styled from "styled-components";
import { Modal } from "antd";

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

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 20px 10px 20px 20px;

    .ActivityList_Modal {
      max-height: 70vh;
      min-height: 300px;
      overflow-y: auto;
      margin-top: 24px;
      padding-right: 10px;
    }
  }
`;

export const ActivityTheme = {
  token: {
    // global token
  },
  components: {
    // component token
  },
};
