import { Payliststyled } from "./styled";
import { useEffect, useState } from "react";
import { Button, ConfigProvider, Modal, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import axiosInstance from "@/lib/axios";
import dayjs from "dayjs";
import TitleCompo from "@/components/TitleCompo";
import { useAuthStore } from "@/stores/useAuthStore";
import { AntdGlobalTheme } from "@/utill/antdtheme";

interface PaymentItem {
  id: number;
  orderId: string;
  userName: string;
  price: number;
  created_at: string;
}

const Paylist = () => {
  const [data, setData] = useState<PaymentItem[]>([]);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const adminId = useAuthStore((state) => state.user?.id); //도우미 id

  // 결제리스트 요청
  const fetchPaymentList = async () => {
    console.log("!!!!!!!!", adminId);

    try {
      const res = await axiosInstance.get<PaymentItem[]>(
        "/program/payment-list",
        { params: { type: "user", adminId } }
      );
      console.log("Da", res.data);
      setData(res.data);
    } catch (error) {
      console.error("결제 리스트 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchPaymentList();
  }, []);

  // 테이블 헤더
  const columns: ColumnsType<PaymentItem> = [
    {
      title: "번호",
      dataIndex: "key",
      key: "key",
      render: (_, __, index) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "주문번호",
      dataIndex: "orderId",
      key: "orderId",
    },
    {
      title: "보호자",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "결제금액",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()}원`,
    },
    {
      title: "결제일",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "정산하기",
      dataIndex: "pay",
      render: (_: any, record: any) => {
        return (
          <ConfigProvider theme={AntdGlobalTheme}>
            <Button
              onClick={() => {
                Modal.info({
                  title: "준비중입니다",
                  content: "정산 기능은 현재 준비 중입니다.",
                  centered: true,
                });
              }}
            >
              정산하기
            </Button>
          </ConfigProvider>
        );
      },
    },
  ];

  return (
    <Payliststyled>
      <TitleCompo title="결제 목록" />
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: data.length,
          onChange: (page, pageSize) =>
            setPagination({ current: page, pageSize }),
        }}
      />
    </Payliststyled>
  );
};

export default Paylist;
