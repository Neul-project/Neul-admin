import styled from "styled-components";
import { Modal } from "antd";

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

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 20px 10px 20px 20px;
  }
  .statuslist_modalbox {
    max-height: 70vh;
    min-height: 300px;
    overflow-y: auto;
    margin-top: 24px;
    padding-right: 10px;
  }
`;
