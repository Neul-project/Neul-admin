import { Payliststyled } from "./styled";
import { useEffect, useState } from "react";
import { Button, ConfigProvider, Modal, Popover, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import axiosInstance from "@/lib/axios";
import dayjs from "dayjs";
import TitleCompo from "@/components/TitleCompo";
import { useAuthStore } from "@/stores/useAuthStore";
import { AntdGlobalTheme, GreenTheme } from "@/utill/antdtheme";
import { InfoCircleFilled } from "@ant-design/icons";

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
    try {
      const res = await axiosInstance.get<PaymentItem[]>(
        "/program/payment-list",
        { params: { type: "user", adminId } }
      );
      setData(res.data);
    } catch (error) {
      console.error("결제 리스트 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (!adminId) return;
    fetchPaymentList();
  }, [adminId]);

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
          <ConfigProvider theme={GreenTheme}>
            <Button
              onClick={() => {
                Modal.info({
                  title: "준비중입니다",
                  content: "정산 기능은 현재 준비 중입니다.",
                  centered: true,
                  okText: "확인",
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
      <div className="paylist_box">
        <TitleCompo title="결제 목록" />
        <Popover
          className="paylist_popover"
          placement="bottom"
          content="※ 결제 금액 중 일부는 결제 수수료 및 세금으로 사용되며, 실제 정산 금액은 약 3.3% 차감된 후 지급됩니다."
        >
          <InfoCircleFilled style={{ fontSize: "16px", color: "#c9c9c9" }} />
        </Popover>
      </div>
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
