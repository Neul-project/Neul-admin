import styled from "styled-components";

export const SchedulePageStyled = styled.div`
  &.schedule_wrap {
    padding: 20px;

    .ant-picker-panel .ant-picker-cell {
      height: 90px !important;
    }

    .ant-picker-cell-inner {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 4px;
    }

    .schedule_events {
      list-style: none;
      margin: 0;
      padding: 0;

      li {
        display: flex;
        align-items: center;
        margin-top: 2px;

        .schedule_bar {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: ${(props) => props.theme.colors.softGreen};
          margin-right: 4px;
        }

        .schedule_name {
          font-size: 12px;
          color: #333;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .schedule_select {
      padding-top: 24px;
      margin-top: 24px;
      border-top: 1px solid #eee;

      .schedule_content_title {
        font-size: 20px;
        font-weight: bolder;
        margin-bottom: 10px;
      }

      .schedule_item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        border: 1px solid #eee;
        border-radius: 6px;
        margin-bottom: 8px;
        .schedule_phone {
          color: #999;
        }
        .schedule_content_box {
          display: flex;
          align-items: center;
          .schedule_calender_icon {
            font-size: 20px;
          }

          .schedule_content {
            display: flex;
            flex-direction: column;
            .schedule_date {
              margin-left: 10px;
              font-size: 12px;
              color: #999;
            }
            .schedule_patient {
              margin: 0 0 5px 10px;

              .schedule_user {
                margin-left: 5px;
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
`;
