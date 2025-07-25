import styled from "styled-components";
import { Modal } from "antd";

export const ActivityListStyled = styled.div`
  &.ActivityList_main_wrap {
    .ant-table-wrapper .ant-table-pagination-right {
      justify-content: center;
    }

    .ant-table-cell {
      text-align: center;
    }
    .ant-table-thead > tr > th {
      text-align: center;
    }

    .ActivitiyList_status {
      display: flex;
      justify-content: space-between;
      margin-bottom: 13px;

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
        gap: 5px;
      }
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
  }
`;

export const StyledModal = styled(Modal)`
  .ant-modal-content {
    padding: 0px 10px 20px 20px;

    .ant-modal-title {
      padding-top: 10px;
    }

    .ActivityList_Modal {
      max-height: 70vh;
      min-height: 300px;
      overflow-y: auto;
      margin-top: 24px;
      padding-right: 10px;
    }
  }
`;
