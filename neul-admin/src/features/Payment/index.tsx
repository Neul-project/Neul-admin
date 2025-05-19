import { PaymentStyled } from "./styled";
import { useEffect, useState } from "react";
import { Button, Table, Modal, message } from "antd";
import type { ColumnsType } from "antd/es/table";
import axiosInstance from "@/lib/axios";
import { formatPhoneNumber } from "@/utill/formatter";
import dayjs from "dayjs";

interface PaymentItem {
  id: number;
  programId: number;
  programName: string;
  programManager: string;
  payer: string;
  price: number;
  phone: string;
  create_at: string;
}

const PaymentPage = () => {
  const [data, setData] = useState<PaymentItem[]>([]);

  // 테이블 헤더

  const columns: ColumnsType<PaymentItem> = [
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
      title: "강사명",
      dataIndex: "programManager",
      key: "programManager",
    },
    {
      title: "결제자",
      dataIndex: "payer",
      key: "payer",
    },
    {
      title: "결제금액",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()}원`,
    },
    {
      title: "결제일",
      dataIndex: "create_at",
      key: "create_at",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
  ];

  // 결제리스트 요청
  useEffect(() => {
    const fetchPaymentList = async () => {
      try {
        const res = await axiosInstance.get<PaymentItem[]>(
          "/program/payment-list"
        );

        console.log("결제 리스트 응답", res.data);
        setData(res.data);
      } catch (error) {
        console.error("결제 리스트 불러오기 실패:", error);
      }
    };

    fetchPaymentList();
  }, []);

  return (
    <PaymentStyled>
      <div className="Payment_title">결제 목록</div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        rowKey="id"
      />
    </PaymentStyled>
  );
};

export default PaymentPage;
