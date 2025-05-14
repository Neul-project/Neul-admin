import { Modal } from "antd";
import styled from "styled-components";

export const ProgramlistStyled = styled.div`
  &.Programlist_main_wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .Programlist_btns {
      display: flex;
      width: 100%;
      justify-content: end;
    }

    .Programlist_btns {
      gap: 10px;
    }
  }
`;

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 20px 10px 20px 20px;

    .ProgramWrite_Modal {
      max-height: 70vh;
      min-height: 300px;
      overflow-y: auto;
      margin-top: 24px;
      padding-right: 10px;
    }
  }
`;
