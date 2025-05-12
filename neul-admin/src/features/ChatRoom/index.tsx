import { useEffect, useMemo, useRef, useState } from "react";
import { ChatRoomStyled } from "./styled";
import SendOutlined from "@ant-design/icons/SendOutlined";
import ChatMessage from "../../components/ChatMessage";
import io from "socket.io-client";
import clsx from "clsx";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import axiosInstance from "@/lib/axios";
import "dayjs/locale/ko"; // 한국어 로케일 불러오기
import { message, Modal } from "antd";
import { useAuthStore } from "@/stores/useAuthStore";

dayjs.locale("ko"); // 로케일 설정

//Chatting 인터페이스 정의
interface Chatting {
  id: number;
  user: any;
  admin: any;
  message: string;
  read: boolean;
  time: string;
  date: string;
  sender: string;
  created_at: string;
}

interface ChatRoomPreview {
  id: number;
  userId: number; // 보호자 id
  userName: string; // 보호자 이름
  patientName: string; // 피보호자 이름
  lastMessage: string;
  lastTime: string; // "2025-04-29 17:09"
  unreadCount?: number;
}

// 채팅 전체 화면
const ChatRoom = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatRoomList, setChatRoomList] = useState<ChatRoomPreview[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [chattings, setChattings] = useState<Chatting[]>([]);

  const socketRef = useRef<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  dayjs.extend(localizedFormat);
  dayjs.locale("ko");

  const adminId = useAuthStore((state) => state.user?.id);
  console.log("관리자 id", adminId);

  // 무조건 아래에서 시작하도록
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  };

  // 채팅방 목록 불러오기
  const fetchChatRoomList = async () => {
    try {
      const res = await axiosInstance.get("/chat/rooms", {
        params: { adminId },
      });

      console.log("채팅방 목록 ", res.data);
      setChatRoomList(res.data);
    } catch (e) {
      console.error("채팅방 목록 불러오기 실패: ", e);
    }
  };

  // 채팅 목록 가져오기 요청
  const handleSelectUser = async (userId: number) => {
    setSelectedUserId(userId);

    console.log("------------유저 아이디----------", userId);

    try {
      const res = await axiosInstance.get(`/chat/list`, {
        params: { userId },
      });

      console.log("목록 왔다", res.data);

      // 데이터 가공
      const parsedChats: Chatting[] = res.data.map((chat: any) => {
        // 시간, 날짜
        const date = dayjs(chat.created_at).format("YYYY년 MM월 DD일");
        const time = dayjs(chat.created_at).format("A h:mm");

        return {
          ...chat,
          date,
          time,
        };
      });

      setChattings(parsedChats);

      // 읽음 처리 요청
      axiosInstance.post("/chat/read", {
        userId,
        adminId,
      });

      // 선택 시 unreadCount 초기화
      setChatRoomList((prevRooms) =>
        prevRooms.map((room) =>
          room.userId === userId ? { ...room, unreadCount: 0 } : room
        )
      );
    } catch (e) {
      console.error("선택한 유저의 채팅 불러오기 실패:", e);
    }
  };

  useEffect(() => {
    if (!adminId) return;

    console.log("선택된 userID", selectedUserId);
    // 채팅방 불러오기(자신의 담당 보호자-피보호자들)
    fetchChatRoomList();

    // 소켓 연결
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
    });

    socketRef.current.off("receive_message"); // 기존 리스너 제거
    socketRef.current.on("receive_message", (message: Chatting) => {
      if (message.user.id === selectedUserId) {
        const date = dayjs(message.created_at).format("YYYY년 MM월 DD일");
        const time = dayjs(message.created_at).format("A h:mm");

        const parsedMessage = {
          ...message,
          date,
          time,
        };

        // 현재 보고 있는 방이면 그냥 append
        setChattings((prev) => [...prev, parsedMessage]);

        // 읽음 처리 요청
        axiosInstance.post("/chat/read", {
          userId: selectedUserId,
          adminId,
        });
      } else {
        // 다른 방이면 unreadCount 증가
        setChatRoomList((prevRooms) =>
          prevRooms.map((room) =>
            room.userId === message.user.id
              ? { ...room, unreadCount: (room.unreadCount || 0) + 1 }
              : room
          )
        );
      }
    });

    return () => {
      // 컴포넌트가 언마운트될 때 소켓 연결 종료
      socketRef.current?.off("receive_message");
      socketRef.current?.disconnect();
    };
  }, [adminId, selectedUserId]);

  // 새로운 채팅이 추가될 때마다 자동으로 스크롤 맨 아래로
  useEffect(() => {
    scrollToBottom();
  }, [chattings]);

  // 날짜별로 그룹화
  const groupDate = useMemo(() => {
    return chattings.reduce((acc: Record<string, Chatting[]>, chat) => {
      if (!acc[chat.date]) acc[chat.date] = [];
      acc[chat.date].push(chat);
      return acc;
    }, {});
  }, [chattings]);

  // 채팅 보내기
  const sendMessage = async () => {
    if (!inputValue.trim() || selectedUserId === null) return;

    // 채팅 객체
    const messageToSend = {
      userId: selectedUserId, // 상대방 id
      message: inputValue, // 보낼 메시지 내용
      sender: "admin",
    };

    try {
      // 소켓 실시간 메시지 전송
      socketRef.current.emit("send_message", messageToSend);

      // 입력창 초기화
      setInputValue("");
    } catch (e) {
      console.error("채팅 메시지 전송 실패:", e);
    }
  };

  const onClickDeleteChattingRoom = (
    e: React.MouseEvent<HTMLDivElement>,
    userId: number
  ) => {
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!유저 id", userId);
    e.preventDefault();

    Modal.confirm({
      title: "해당 채팅방 내용을 삭제하시겠습니까?",
      content: "삭제한 내용은 복구할 수 없습니다.",
      okText: "삭제",
      cancelText: "취소",
      okButtonProps: {
        style: { backgroundColor: "#5DA487" },
      },
      cancelButtonProps: {
        style: { color: "#5DA487" },
      },
      async onOk() {
        if (userId == null) return;
        try {
          await axiosInstance.delete(`/chat/alldelete`, {
            params: { userId },
          });
          message.success("해당 채팅방 내용이 삭제되었습니다.");
          fetchChatRoomList();
          if (selectedUserId === userId) {
            setChattings([]);
          }
        } catch (e) {
          console.error("해당 채팅방 내용 삭제 실패: ", e);
          message.error("해당 채팅방 내용 삭제에 실패했습니다.");
        }
      },
    });
  };

  return (
    <ChatRoomStyled className={clsx("chatroom_wrap")}>
      {/* 채팅 상대 선택 */}
      <div className="chatroom_select">
        {chatRoomList.length !== 0 ? (
          <>
            {chatRoomList.map((room) => (
              <div
                key={room.userId}
                className={`chatroom_item ${
                  selectedUserId === room.userId ? "selected" : ""
                }`}
                onClick={() => handleSelectUser(room.userId)}
                onContextMenu={(e) => onClickDeleteChattingRoom(e, room.userId)}
              >
                <div className="chatroom_name_box">
                  <div className="chatroom_name">
                    {room.patientName}님의 보호자님 -{" "}
                    <span>{room.userName}</span>
                  </div>
                  <div className="chatroom_lasttime">
                    {(() => {
                      const now = dayjs();
                      const last = dayjs(room.lastTime, "YYYY-MM-DD HH:mm");
                      return last.isSame(now, "day")
                        ? last.format("A h:mm") // 오후 5:09
                        : last.format("YYYY-MM-DD");
                    })()}
                  </div>
                </div>
                <div className="chatroom_lastmessage_box">
                  <span className="chatroom_lastmessage">
                    {room.lastMessage}
                  </span>
                  {room.unreadCount ? (
                    <span className="chatroom_unread">{room.unreadCount}</span>
                  ) : null}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="chatroom_unpeople">
            담당하고 있는 피보호자가 없습니다.
          </div>
        )}
      </div>
      {/* 채팅 내용 */}
      <div className="chatroom_content_box">
        <div className="chatroom_content">
          {selectedUserId ? (
            <>
              {Object.entries(groupDate).map(([date, messages]) => (
                <div key={date}>
                  <div className="chatroom_date">{date}</div>
                  {messages.map((chat, i) => {
                    const currentTime = chat.time;
                    const nextTime = messages[i + 1]?.time;
                    const shouldShowTime = currentTime !== nextTime;
                    return (
                      <ChatMessage
                        key={chat.id}
                        name={i === 0 || shouldShowTime ? chat.user.name : ""}
                        message={chat.message}
                        time={shouldShowTime ? chat.time : ""}
                        sender={chat.sender}
                      />
                    );
                  })}
                </div>
              ))}
              <div ref={bottomRef} />
            </>
          ) : (
            <div className="chatroom_uncontent">채팅방을 선택해주세요.</div>
          )}
        </div>
        {/* 보내는 메시지 */}
        {selectedUserId && (
          <div className="chatroom_message_box">
            <div className="chatroom_message">
              <input
                type="text"
                placeholder="메시지 입력"
                value={inputValue}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
              />
            </div>
            <SendOutlined
              className={`chatroom_sendbtn ${
                inputValue.trim() === "" ? "chatroom_disabled" : ""
              }`}
              onClick={sendMessage}
            />
          </div>
        )}
      </div>
    </ChatRoomStyled>
  );
};

export default ChatRoom;
