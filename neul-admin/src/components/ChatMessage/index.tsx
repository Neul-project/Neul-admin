import clsx from "clsx";
import { ChatMessageStyled } from "./styled";

interface ChatMessageProps {
  name: string; // 상대 이름
  message: string; // 채팅 내용
  time: string; // 보낸 시간
  isMe: boolean; // 본인이 작성한 chat인지 확인
}

// 채팅 메시지(본인이 작성한 것인지 판단)
const ChatMessage = ({ name, message, time, isMe }: ChatMessageProps) => {
  return (
    <ChatMessageStyled className={clsx("chatmessage_wrap")}>
      <div className={`${isMe ? "chatmessage_me" : "chatmessage_other"}`}>
        {!isMe && <div className="chatmessage_name">{name}</div>}

        <div className="chatmessage_chat">
          <div className="chatmessage_text">{message}</div>
          <div className="chatmessage_time">{time}</div>
        </div>
      </div>
    </ChatMessageStyled>
  );
};

export default ChatMessage;
