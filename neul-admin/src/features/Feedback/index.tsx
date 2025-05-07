import { useEffect, useState } from "react";
import { FeedbackStyled } from "./styled";
import axiosInstance from "@/lib/axios";
import { Table, TableProps, Select, Modal } from "antd";

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

const columns: TableProps<DataType>["columns"] = [
  { title: "번호", dataIndex: "key", key: "key" },
  { title: "내용", dataIndex: "content", key: "content" },
  { title: "날짜", dataIndex: "date", key: "date" },
];

const Feedback = () => {
  const [adminId, setAdminId] = useState<number>();
  const [list, setList] = useState<DataType[]>();
  const [adminlist, setAdminlist] = useState<AdminType[]>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null);

  useEffect(() => {
    axiosInstance.get(`/user/adminlist`).then((res) => {
      const data: AdminType[] = res.data;
      setAdminlist([{ value: 0, label: "전체" }, ...data]);
    });

    axiosInstance
      .get(`/activity/feedback/views`, { params: { adminId } })
      .then((res) => {
        const data = res.data;
        const mappedList: DataType[] = data.map((item: any) => ({
          key: item.id,
          content: item.message,
          date: item.recorded_at,
          admin: item.activity.id,
          origin: item,
        }));
        setList(mappedList);
      });
  }, []);

  const handleChange = (option: { value: number; label: string }) => {
    //console.log(`selected ${option.value}`);
    setAdminId(option.value);
    if (option.value === 0) {
      //전체 feedback내용 보여지기
      axiosInstance
        .get("/activity/feedback/views", { params: { adminId } })
        .then((res) => {
          //console.log("activity feedback views res", res.data);
          const data = res.data;
          const mappedList: DataType[] = data.map((item: any) => ({
            key: item.id,
            content: item.message,
            date: item.recorded_at,
            admin: item.activity.id,
            origin: item,
          }));

          setList(mappedList);
        });
    } else {
      //도우미 id에 해당하는 feedback내용 보여지기
      axiosInstance
        .get("/activity/feedback/view", { params: { adminId: 5 } })
        .then((res) => {
          //console.log("activity feedback view res", res.data);
          const data = res.data;
          const mappedList: DataType[] = data.map((item: any) => ({
            key: item.id,
            content: item.message,
            date: item.recorded_at,
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
        <Select
          defaultValue={{ value: 0, label: "전체" }}
          style={{ width: 120 }}
          onChange={handleChange}
          options={adminlist}
          labelInValue
        />
      </div>
      <Table<DataType>
        columns={columns}
        dataSource={list}
        onRow={(record) => ({
          onClick: () => {
            setSelectedRecord(record);
            setIsModalOpen(true);
          },
        })}
      />
      <Modal
        title="피드백 상세"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        className="Feedback_Modal"
      >
        {selectedRecord && (
          <div className="Feedback_content">
            <div>
              <strong>번호:</strong> {selectedRecord.key}
            </div>
            <div>
              <strong>내용:</strong> {selectedRecord.content}
            </div>
            <div>
              <strong>날짜:</strong> {selectedRecord.date}
            </div>
          </div>
        )}
      </Modal>
    </FeedbackStyled>
  );
};

export default Feedback;
