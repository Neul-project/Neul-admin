import styled from "styled-components";

export const ChatRoomStyled = styled.div`
  &.chatroom_wrap {
    display: flex;

    .chatroom_select {
      overflow-y: scroll;
      width: 35%;
      height: 82vh;
      border-top: 1.5px solid #ccc;
      border-left: 1.5px solid #ccc;
      border-bottom: 1.5px solid #ccc;
      .chatroom_unpeople {
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #999;
      }
      .chatroom_item {
        height: 65.3px;
        padding: 10px;
        border-bottom: 1px solid #eee;
        cursor: pointer;

        &.selected {
          background-color: #f5f5f5;
        }
        .chatroom_name_box {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .chatroom_name {
            display: flex;
            font-weight: bold;
            width: 180px;
            .chatroom_stick {
              margin: 0 5px;
            }
            .chatroom_patientname,
            .chatroom_username {
              text-overflow: ellipsis;
              overflow: hidden;
              word-break: break-all;

              display: -webkit-box;
              -webkit-line-clamp: 1; // 원하는 라인수
              -webkit-box-orient: vertical;
            }

            span {
              font-size: 14px;
            }
          }
          .chatroom_lasttime {
            font-size: 0.75rem;
            color: #999;
            margin-top: 2px;
          }
        }

        .chatroom_lastmessage_box {
          color: #555;
          font-size: 0.9rem;
          margin-top: 4px;
          display: flex;
          justify-content: space-between;

          .chatroom_lastmessage {
            width: 250px;
            text-overflow: ellipsis;
            overflow: hidden;
            word-break: break-all;

            display: -webkit-box;
            -webkit-line-clamp: 1; // 원하는 라인수
            -webkit-box-orient: vertical;
          }
          .chatroom_unread {
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            background-color: red;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            font-size: 12px;
          }
        }
      }
    }

    /* 채팅 내용 */
    .chatroom_content_box {
      width: 65%;
      height: 82vh;
      display: flex;
      flex-direction: column;
      border: 0.7px solid #ccc;

      .chatroom_content {
        flex: 1;
        overflow-y: auto;

        /* Firefox */
        /* scrollbar-width: none; */
        /* IE 10+ */
        /* -ms-overflow-style: none; */

        padding: 10px;
        box-sizing: border-box;
        .chatroom_date {
          text-align: center;
          color: #ccc;
          margin-top: 20px;
        }
        .chatroom_uncontent {
          color: #999;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .chatroom_content::-webkit-scrollbar {
        /* Chrome, Safari, Edge */
        /* display: none; */
      }

      /* 메시지 보내는 부분 */
      .chatroom_message_box {
        display: flex;
        align-items: center;
        padding: 10px;
        border-top: 1px solid #ccc;
        .chatroom_message {
          width: 100%;
          input {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            outline: none;
            border-radius: 20px;
            border: none;
            background-color: #eee;
          }
        }
        .chatroom_sendbtn {
          margin-left: 8px;
          font-size: 20px;
          padding: 8px;
          border-radius: 50%;
          background-color: ${(props) => props.theme.colors.pointGreen};
          color: white;
          &:hover {
            cursor: pointer;
          }
        }
        .chatroom_disabled {
          opacity: 0.4;
          pointer-events: none;
        }
      }
    }
  }
`;
