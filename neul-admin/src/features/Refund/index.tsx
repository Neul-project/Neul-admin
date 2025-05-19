import { useEffect, useState } from "react";
import { RefundStyled, Divider } from "./styled";
import { Button, Table, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import axiosInstance from "@/lib/axios";
import { formatPhoneNumber } from "@/utill/formatter";
import dayjs from "dayjs";

interface RefundItem {
  // key: number;
  id: number;
  programId: number;
  requester: string;
  bank: string;
  account: string;
  depositor: string;
  reason: string;
  programName: string;
  email: string;
  phone: string;
  price: number;
  status: string;
  create_at: string;
}

const RefundPage = () => {
  const [dataSource, setDataSource] = useState<RefundItem[]>([]);

  // 환불 리스트 요청
  useEffect(() => {
    const fetchRefundList = async () => {
      try {
        const res = await axiosInstance.get<RefundItem[]>(
          "/program/refund-list"
        );

        console.log("환불 리스트 응답", res.data);
        setDataSource(res.data);
      } catch (error) {
        console.error("환불 리스트 불러오기 실패:", error);
      }
    };

    fetchRefundList();
  }, []);

  const [selectedRecord, setSelectedRecord] = useState<RefundItem | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 보기 클릭 → 모달 열기
  const handleOpenModal = (record: RefundItem) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  // 환불 '완료' 상태로 변경요청
  const handleComplete = async () => {
    if (!selectedRecord) return;

    try {
      const res = await axiosInstance.post("/program/refund-complete", {
        id: selectedRecord.programId,
      });

      // console.log("환불 완료 응답", res.data);

      if (res.data.ok === true) {
        message.success(
          `${selectedRecord.requester}님의 환불 상태가 '완료'로 변경되었습니다.`
        );

        // 상태만 '환불 완료'로 업데이트
        setDataSource((prev) =>
          prev.map((item) =>
            item.programId === selectedRecord.programId
              ? { ...item, status: "환불 완료" }
              : item
          )
        );
      } else {
        throw new Error("서버 응답 실패");
      }
    } catch (error) {
      message.error("환불 처리 중 오류가 발생했습니다.");
      console.error("환불 완료 요청 실패:", error);
    } finally {
      setIsModalVisible(false); // 모달 닫기
    }
  };

  // 테이블 컬럼
  const columns: ColumnsType<RefundItem> = [
    {
      title: "번호",
      dataIndex: "key",
      key: "key",
      render: (_, __, index) => index + 1,
    },
    {
      title: "프로그램명",
      dataIndex: "programName",
      key: "programName",
    },
    {
      title: "요청자",
      dataIndex: "requester",
      key: "requester",
    },
    {
      title: "상태",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span style={{ color: status === "환불 완료" ? "#5da487" : "orange" }}>
          {status === "환불 완료" ? "환불 완료" : "환불 대기"}
        </span>
      ),
    },
    {
      title: "요청일",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "보기",
      key: "action",
      render: (_, record) => (
        <Button type="default" onClick={() => handleOpenModal(record)}>
          보기
        </Button>
      ),
    },
  ];

  return (
    <RefundStyled>
      <div className="Refund_title">환불 목록</div>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
        rowKey="id"
      />

      {/* 상세 보기 모달 */}
      <Modal
        title="환불 상세보기"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          selectedRecord?.status !== "환불 완료" && (
            <Button key="complete" type="primary" onClick={handleComplete}>
              완료 상태로 변경
            </Button>
          ),
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            닫기
          </Button>,
        ]}
      >
        {selectedRecord && (
          <div style={{ lineHeight: "1.8", marginTop: 15 }}>
            <p>
              <strong>프로그램명:</strong> {selectedRecord.programName}
            </p>
            <p>
              <strong>요청자:</strong> {selectedRecord.requester}
            </p>
            <p>
              <strong>이메일:</strong> {selectedRecord.email}
            </p>
            <p>
              <strong>전화번호:</strong>{" "}
              {formatPhoneNumber(selectedRecord.phone)}
            </p>

            <Divider />

            <p>
              <strong>은행명:</strong> {selectedRecord.bank}
            </p>
            <p>
              <strong>계좌번호:</strong> {selectedRecord.account}
            </p>
            <p>
              <strong>입금자명:</strong> {selectedRecord.depositor}
            </p>
            <p>
              <strong>환불 금액:</strong>{" "}
              {selectedRecord.price.toLocaleString()}원
            </p>
            <p>
              <strong>환불 사유:</strong> {selectedRecord.reason}
            </p>
          </div>
        )}
      </Modal>
    </RefundStyled>
  );
};

export default RefundPage;
