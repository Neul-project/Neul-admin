import styled from "styled-components";
import { Modal } from "antd";

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 10px 10px 20px 20px;
  }
`;

export const FeedbackStyled = styled.div`
  .ant-table-wrapper .ant-table-pagination-right {
    justify-content: center;
  }
  .Feedback_admin_choice {
    display: flex;
    justify-content: space-between;

    .Feedback_admin_select {
      display: flex;
      flex-direction: row;
      gap: 10px;
      align-items: center;
      margin-bottom: 15px;
    }

    .Feedback_search {
      width: 300px;
    }
  }

  .ant-table-cell {
    text-align: center;
  }
  .ant-table-thead > tr > th {
    text-align: center;
  }

  .ant-pagination-item {
    border-color: #5da487 !important;
    color: #5da487 !important;
  }

  .ant-pagination-item-active {
    border-color: #5da487 !important;
    //box-shadow: 0 0 0 0px #5da487 !important;
    color: #5da487 !important;
  }

  .ant-pagination-item-active a {
    border-color: #5da487 !important;
    //box-shadow: 0 0 0 0px #5da487 !important;
    color: #5da487 !important;
  }

  .ant-select-item-option-selected {
    background-color: #5da487 !important;
    color: #fff !important;
  }
`;
