import { useEffect, useMemo, useRef, useState } from "react";
import { ChatRoomStyled } from "./styled";
import SendOutlined from "@ant-design/icons/SendOutlined";
import ChatMessage from "../../components/ChatMessage";
import io from "socket.io-client";
import clsx from "clsx";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/ko";
import axiosInstance from "@/lib/axios";

// 백엔드랑 연결할거 -> 채팅 목록 불러오기, 채팅미리보기 불러오기, 서버에 메시지 저장 요청

//Chatting 인터페이스 정의
interface Chatting {
  id: number;
  userId?: number; // 보호자 id
  adminId?: number; // 관리자 id
  name: string; // 보호자 or 관리자 이름
  message: string;
  time: string;
  date: string;
  isMe: boolean;
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

const dummyUser = [
  {
    id: 1,
    userId: 1,
    userName: "권민수",
    patientName: "아이",
    lastMessage: "아 그런가요",
    lastTime: "2025-04-29 17:09",
    unreadCount: 1,
  },
  {
    id: 2,
    userId: 2,
    userName: "아민아",
    patientName: "아이민",
    lastMessage: "네네",
    lastTime: "2025-05-05 17:59",
  },
];

// 채팅 전체 화면
const ChatRoom = () => {
  const [inputValue, setInputValue] = useState("");
  const [chatRoomList, setChatRoomList] = useState<ChatRoomPreview[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [chattings, setChattings] = useState<Chatting[]>([
    {
      id: 1,
      userId: 1,
      name: "보호자",
      message: `혹시 그때 가능한가요?`,
      time: "17:06",
      date: "2025년 4월 28일",
      isMe: false,
    },
    {
      id: 2,
      adminId: 2,
      name: "도우미",
      message: `내 가능합니다`,
      time: "17:07",
      date: "2025년 4월 28일",
      isMe: true,
    },
    {
      id: 3,
      userId: 3,
      name: "보호자",
      message: `그럼 그때로 할게요`,
      time: "17:08",
      date: "2025년 4월 28일",
      isMe: false,
    },
    {
      id: 4,
      adminId: 4,
      name: "도우미",
      message: `네^^`,
      time: "17:09",
      date: "2025년 4월 29일",
      isMe: true,
    },
  ]);

  const socketRef = useRef<any>(null);

  dayjs.extend(localizedFormat);
  dayjs.locale("ko");

  const userId = 1; //아직 로그인한 사용자 정보 없어서 임의로 정해놓음
  const adminId = 1; //로그인한 임의의 관리자id

  // 채팅방 목록 불러오기
  const fetchChatRoomList = async () => {
    try {
      const res = await axiosInstance.get("/chat/rooms", {
        params: { adminId },
      });
      setChatRoomList(res.data);

      //[{id(채팅방 고유 id),userId(보호자 id),userName(관리자가 담당하고 있는 보호자 이름),
      // patientName(해당 보호자의 피보호자 이름),lastMessage(마지막으로 보낸 채팅 내용),lastTime(마지막 채팅 보낸 시각),unreadCount(안 읽은 알림 개수)}]

      // setChatRoomList(dummyUser);
    } catch (e) {
      console.error("채팅방 목록 불러오기 실패: ", e);
    }
  };

  // 채팅 목록 가져오기 요청
  const handleSelectUser = async (userId: number) => {
    setSelectedUserId(userId);

    try {
      const res = await axiosInstance.get(`/chat/list`, {
        params: { userId },
      });
      // [{채팅 고유 id(id),  userId 또는 adminId(작성한 사람 id), 채팅 작성한 사람 이름(name), 채팅 내용(message),
      //  채팅 작성 시간(time), 채팅 작성 날짜(date), 사용자 본인이 작성한지 여부(isMe)}] 보내주기
      setChattings(res.data);

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
    // 채팅방 불러오기(자신의 담당 보호자-피보호자들)
    fetchChatRoomList();

    // 소켓 연결
    socketRef.current = io(process.env.NEXT_PUBLIC_API_URL, {
      withCredentials: true,
    });

    socketRef.current.off("receive_message"); // 기존 리스너 제거
    socketRef.current.on("receive_message", (message: Chatting) => {
      if (message.userId === selectedUserId) {
        // 현재 보고 있는 방이면 그냥 append
        setChattings((prev) => [...prev, message]);
      } else {
        // 다른 방이면 unreadCount 증가
        setChatRoomList((prevRooms) =>
          prevRooms.map((room) =>
            room.userId === message.userId
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
  }, [selectedUserId]);

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
      adminId, //로그인한 관리자 id
      message: inputValue, // 보낼 메시지 내용
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

  return (
    <ChatRoomStyled className={clsx("chatroom_wrap")}>
      {/* 채팅 상대 선택 */}
      <div className="chatroom_select">
        {chatRoomList.map((room) => (
          <div
            key={room.userId}
            className={`chatroom_item ${
              selectedUserId === room.userId ? "selected" : ""
            }`}
            onClick={() => handleSelectUser(room.userId)}
          >
            <div className="chatroom_name_box">
              <div className="chatroom_name">
                {room.userName} - {room.patientName}님의 보호자님
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
            <div className="chatroom_lastmessage">
              {room.lastMessage}{" "}
              {room.unreadCount ? (
                <span className="chatroom_unread">{room.unreadCount}</span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* 채팅 내용 */}
      <div className="chatroom_content_box">
        <div className="chatroom_content">
          {Object.entries(groupDate).map(([date, messages]) => (
            <div key={date}>
              <div className="chatroom_date">{date}</div>
              {messages.map((chat) => (
                <ChatMessage
                  key={chat.id}
                  name={chat.name}
                  message={chat.message}
                  time={chat.time}
                  isMe={chat.isMe}
                />
              ))}
            </div>
          ))}
        </div>
        {/* 보내는 메시지 */}
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
      </div>
    </ChatRoomStyled>
  );
};

export default ChatRoom;
