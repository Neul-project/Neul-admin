import { useEffect, useState } from "react";
import { FeedbackStyled, StyledModal } from "./styled";
import axiosInstance from "@/lib/axios";
import { AntdGlobalTheme, GreenTheme } from "@/utill/antdtheme";
import { formatDate } from "@/utill/activityoptionlist";
import FeedbackModal from "../FeedbackModal";
import { Table, TableProps, Select, Button, ConfigProvider, Input } from "antd";
import { SearchProps } from "antd/es/input";

const { Search } = Input;

interface DataType {
  key: number;
  content: string;
  date: string;
  // admin: number;
  origin: any;
}

interface AdminType {
  value: number;
  label: string;
}

//피드백 리스트 컴포넌트
const Feedback = () => {
  //변수 선언
  const [list, setList] = useState<DataType[]>(); //피드백 배열 관리
  const [adminlist, setAdminlist] = useState<AdminType[]>(); //select 관리
  const [isModalOpen, setIsModalOpen] = useState(false); //상세 모달 여부확인
  const [selectedRecord, setSelectedRecord] = useState<DataType | null>(null); //모달로 넘길 내용
  const [searchValue, setSearchValue] = useState(""); //검색 내용
  const [selectedAdmin, setSelectedAdmin] = useState<number>(0); //select로 선택된 어드민 id

  //테이블 열
  const columns: TableProps<DataType>["columns"] = [
    { title: "번호", dataIndex: "number", key: "number" },
    { title: "활동기록", dataIndex: "activity", key: "activity" },
    { title: "날짜", dataIndex: "date", key: "date" },
    {
      key: "typeBtn",
      title: "상세",
      render: (_: any, record: any) => {
        return (
          <Button
            onClick={() => {
              //console.log("re", record);
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

  //활동기록 검색
  const onSearch: SearchProps["onSearch"] = (value?: any, _e?, info?) => {
    //console.log("value", value, _e, info);
    // console.log("sele", selectedAdmin);
    //피드백 : 활동기록 제목(title) 검색에 따른 행(피드백) 반환 요청
    feedbackview(selectedAdmin, value);
  };

  //admin id에 해당하는 피드백 내용 가져오기
  const feedbackview = (admin?: any, search?: string) => {
    console.log("ad", admin, search);
    //만약 admin이 0인 경우 전체 내용 반환 //search : 검색 내용
    axiosInstance
      .get("/activity/feedback/view", {
        params: { adminId: Number(admin), search: search },
      })
      .then((res) => {
        //console.log("da", res.data);
        const data = res.data;
        const mappedList: DataType[] = data.map((item: any, index: number) => ({
          key: item.id,
          number: index + 1,
          activity: item.activity.title,
          content: item.message,
          date: formatDate(item.recorded_at),
          origin: item,
        }));

        setList(mappedList);
      });
  };

  //화면 초기 렌더링 시 자료 불러오기
  useEffect(() => {
    axiosInstance.get(`/user/adminlist`).then((res) => {
      const data: AdminType[] = res.data;
      setAdminlist([{ value: 0, label: "전체" }, ...data]);
    });
    feedbackview(0, "");
  }, []);

  //select 선택
  const handleChange = (option: { value: number; label: string }) => {
    //value = admin id ; label = admin name
    //console.log(`selected ${option.value}`);
    const admin = option.value;
    setSelectedAdmin(admin);

    if (admin === 0) {
      //sleect 전체 선택 - 전체 피드백 내용 보여주기
      setSearchValue("");
      feedbackview(0);
    } else {
      //도우미 id에 해당하는 feedback내용 보여지기
      //console.log("Ad", admin);
      setSearchValue("");
      feedbackview(admin);
    }
  };
  return (
    <FeedbackStyled>
      <div className="Feedback_admin_choice">
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
        <div className="Feedback_admin_select">
          <div>활동기록명</div>
          <ConfigProvider theme={GreenTheme}>
            <Search
              placeholder="활동기록명을 입력하시오."
              onSearch={onSearch}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="Feedback_search"
            />
          </ConfigProvider>
        </div>
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
        <FeedbackModal selectedRecord={selectedRecord} />
      </StyledModal>
    </FeedbackStyled>
  );
};

export default Feedback;
