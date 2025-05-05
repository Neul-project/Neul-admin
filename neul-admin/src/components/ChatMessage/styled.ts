import styled from "styled-components";

export const ChatMessageStyled = styled.div`
  &.chatmessage_wrap {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;

    .chatmessage_chat {
      display: flex;
      align-items: flex-end;
      .chatmessage_text {
        max-width: 40%;
        font-size: 14px;
        word-break: break-word;
        padding: 10px 14px;
        border-radius: 10px;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      }
      .chatmessage_time {
        font-size: 10px;
        color: gray;
      }
    }

    .chatmessage_me {
      .chatmessage_chat {
        flex-direction: row-reverse;
        .chatmessage_text {
          background-color: ${(props) => props.theme.colors.pointBeige};
        }
        .chatmessage_time {
          margin-right: 8px;
        }
      }
    }

    .chatmessage_other {
      .chatmessage_name {
        font-size: 13px;
        margin-bottom: 2px;
        color: gray;
      }
      .chatmessage_time {
        margin-left: 8px;
      }
    }
  }
`;
