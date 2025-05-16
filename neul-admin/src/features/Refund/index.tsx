import { useEffect, useState } from "react";
import { RefundStyled, Divider } from "./styled";
import { Button, Table, Modal, notification } from "antd";
import type { ColumnsType } from "antd/es/table";
import axiosInstance from "@/lib/axios";

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
}

const RefundPage = () => {
  const [dataSource, setDataSource] = useState<RefundItem[]>([
    {
      id: 1,
      programId: 4,
      requester: "홍길동",
      bank: "국민은행",
      account: "12345678910111",
      depositor: "홍길동",
      reason: "개인 사정으로 인한 환불 요청",
      programName: "미술치료 프로그램",
      email: "hong@example.com",
      phone: "01012345678",
    },
    {
      id: 2,
      programId: 5,
      requester: "김영희",
      bank: "신한은행",
      account: "98765432101112",
      depositor: "김영희",
      reason: "중복 신청으로 인한 환불",
      programName: "언어치료 프로그램",
      email: "kim@example.com",
      phone: "01098765432",
    },
  ]);

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

  // 완료 상태로 변경요청
  const handleComplete = async () => {
    if (!selectedRecord) return;

    try {
      const res = await axiosInstance.post("/program/refund-complete", {
        id: selectedRecord.programId,
      });

      console.log("환불 완료 응답", res.data);

      if (res.data.ok === true) {
        notification.success({
          message: "환불 완료",
          description: `${selectedRecord.requester}님의 환불 상태가 '완료'로 변경되었습니다.`,
        });

        // 상태 갱신(완료된 항목은 리스트에서 제외)
        setDataSource((prev) =>
          prev.filter((item) => item.programId !== selectedRecord.programId)
        );
      } else {
        throw new Error("서버 응답 실패");
      }
    } catch (error) {
      notification.error({
        message: "환불 처리 실패",
        description: "서버에 요청 중 문제가 발생했습니다.",
      });
      console.error("환불 완료 요청 실패:", error);
    } finally {
      setIsModalVisible(false); // 모달 닫기
    }
  };

  // 환불 완료 요청
  const handleRefund = (record: RefundItem) => {
    Modal.confirm({
      title: `${record.requester}님의 환불을 처리하시겠습니까?`,
      okText: "확인",
      cancelText: "취소",
      onOk: () => {
        notification.success({
          message: "환불 처리 완료",
          description: `${record.requester}님의 환불이 완료되었습니다.`,
        });

        // 실제 환불 처리 로직 삽입 (예: API 호출)
      },
    });
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
      <div>환불 목록</div>

      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 5 }}
        rowKey="key"
      />

      {/* 상세 보기 모달 */}
      <Modal
        title="환불 상세보기"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="complete" type="primary" onClick={handleComplete}>
            완료 상태로 변경
          </Button>,
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
              <strong>전화번호:</strong> {selectedRecord.phone}
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
              <strong>환불 사유:</strong> {selectedRecord.reason}
            </p>
          </div>
        )}
      </Modal>
    </RefundStyled>
  );
};

export default RefundPage;
