import { useEffect, useState } from "react";
import { FeedbackStyled, StyledModal } from "./styled";
import axiosInstance from "@/lib/axios";
import { Table, TableProps, Select, Modal, Button, ConfigProvider } from "antd";
import { AntdGlobalTheme, paginationstyle } from "@/utill/antdtheme";
import { formatDate } from "@/utill/activityoptionlist";

interface DataType {
  key: number;
  content: string;
  date: string;
  admin: number;
  origin: any;
}

interface AdminType {
  value: number;
  label: string;
}

//피드백 리스트 컴포넌트
const Feedback = () => {
  //변수 선언
  const [list, setList] = useState<DataType[]>();
  const [adminlist, setAdminlist] = useState<AdminType[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);

  const columns: TableProps<DataType>["columns"] = [
    { title: "번호", dataIndex: "number", key: "number" },
    { title: "내용", dataIndex: "content", key: "content" },
    { title: "날짜", dataIndex: "date", key: "date" },

    {
      key: "typeBtn",
      title: "상세",
      render: (_: any, record: any) => {
        return (
          <Button
            onClick={() => {
              //console.log("re", record);
              //setUserName(record.name);
              //setRowId(record.original);
              setSelectedRecord(record);
              setIsModalOpen(true);
            }}
          >
            상세
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    axiosInstance.get(`/user/adminlist`).then((res) => {
      const data: AdminType[] = res.data;
      setAdminlist([{ value: 0, label: "전체" }, ...data]);
    });

    //피드백 내용 전체 불러오기
    axiosInstance.get(`/activity/feedback/views`).then((res) => {
      const data = res.data;
      console.log("data", data);
      const mappedList: DataType[] = data.map((item: any, index: number) => ({
        key: item.id,
        number: index + 1,
        content: item.message,
        date: formatDate(item.recorded_at),
        admin: item.activity.id,
        origin: item,
      }));
      setList(mappedList);
    });
  }, []);

  const handleChange = (option: { value: number; label: string }) => {
    //console.log(`selected ${option.value}`);
    const admin = option.value;
    if (admin === 0) {
      //전체 feedback내용 보여지기
      axiosInstance.get("/activity/feedback/views").then((res) => {
        const data = res.data;
        const mappedList: DataType[] = data.map((item: any) => ({
          key: item.id,
          content: item.message,
          date: formatDate(item.recorded_at),
          admin: item.activity.id,
          origin: item,
        }));

        setList(mappedList);
      });
    } else {
      //도우미 id에 해당하는 feedback내용 보여지기
      //console.log("Ad", admin);
      axiosInstance
        .get("/activity/feedback/view", { params: { adminId: admin } })
        .then((res) => {
          //console.log("activity feedback view res", res.data);
          const data = res.data;
          const mappedList: DataType[] = data.map((item: any) => ({
            key: item.id,
            content: item.message,
            date: formatDate(item.recorded_at),
            admin: item.activity.id,
            origin: item,
          }));

          setList(mappedList);
        });
    }
  };
  return (
    <FeedbackStyled>
      <div className="Feedback_admin_select">
        <div>관리자</div>
        <ConfigProvider theme={AntdGlobalTheme}>
          <Select
            defaultValue={{ value: 0, label: "전체" }}
            style={{ width: 120 }}
            onChange={handleChange}
            options={adminlist}
            labelInValue
          />
        </ConfigProvider>
      </div>
      <ConfigProvider theme={AntdGlobalTheme}>
        <Table<DataType> columns={columns} dataSource={list} />
      </ConfigProvider>
      <StyledModal
        title="피드백 상세"
        width={600}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        {selectedRecord && (
          <div className="Feedback_content">
            <div className="Feedback_content_row">
              <strong>내용 :</strong> {selectedRecord.content}
            </div>
            <div className="Feedback_content_row">
              <strong>날짜 :</strong> {selectedRecord.date}
            </div>
          </div>
        )}
      </StyledModal>
    </FeedbackStyled>
  );
};

export default Feedback;
