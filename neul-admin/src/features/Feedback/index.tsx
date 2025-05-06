import { useEffect, useState } from "react";
import { FeedbackStyled } from "./styled";
import axiosInstance from "@/lib/axios";

//antd
import { Table, TableProps, Select } from "antd";

interface DataType {
  key: string;
  content: string;
  date: string;
  admin: number;
}

interface AdminType {
  value: number;
  label: string;
}

//테이블 열
const columns: TableProps<DataType>["columns"] = [
  {
    title: "번호",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "내용",
    dataIndex: "content",
    key: "content",
  },
  {
    title: "날짜",
    dataIndex: "date",
    key: "date",
  },
];

//dummy data
const data: DataType[] = [
  {
    key: "1",
    content: "너무 성의 없어요",
    date: "2025.01.12",
    admin: 1,
  },
  {
    key: "2",
    content: "너무 재미 없어요",
    date: "2025.01.12",
    admin: 1,
  },
  {
    key: "3",
    content: "너무 실망이에요",
    date: "2025.01.12",
    admin: 1,
  },
];

//피드백 컴포넌트
const Feedback = () => {
  //변수 선언

  //useState
  const [adminId, setAdminId] = useState(1);
  const [list, setList] = useState<DataType[]>();
  const [adminlist, setAdminlist] = useState<AdminType[]>();

  //useEffect
  useEffect(() => {
    //모든 도우미 리스트 조회하기 (value -> adminId label -> name)
    // axiosInstance.get(`/user/adminlist`).then((res)=> {
    //   console.log("all list" , res.data)
    // })

    const admin = [
      { value: 1, label: "Jack" },
      { value: 2, label: "Lucy" },
      { value: 3, label: "yiminghe" },
    ];
    setAdminlist(admin);
  }, []);

  useEffect(() => {
    //전체 feedback내용 보여지기
    axiosInstance.get(`/activity/feedback/views`).then((res) => {
      console.log("activity feedback views res", res.data);
    });
  }, [adminId]);

  const handleChange = (option: { value: number; label: string }) => {
    //console.log(`selected ${value}`);
    setAdminId(Number(option.value));

    //도우미 id에 해당하는 feedback내용 보여지기
    axiosInstance
      .get(`/activity/feedback/view`, { params: { adminId } })
      .then((res) => {
        console.log("activity feedback view res", res.data);
      });
    const matched = data.filter((item) => item.admin === option.value);

    setList(matched);
  };

  return (
    <FeedbackStyled>
      <Select
        defaultValue={{ value: 2, label: "Lucy" }}
        style={{ width: 120 }}
        onChange={handleChange}
        options={adminlist}
        labelInValue
      />
      <Table<DataType> columns={columns} dataSource={list} />
    </FeedbackStyled>
  );
};

export default Feedback;
