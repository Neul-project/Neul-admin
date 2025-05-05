import clsx from "clsx";
import { ActivityListStyled, ActivityTheme, StyledModal } from "./styled";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

//antd
import { Select, Button, Table, Modal, ConfigProvider } from "antd";
import type { TableColumnsType, TableProps } from "antd";

//component
import ActivitySubmit from "@/components/ActivitySubmit";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface DataType {
  key: React.Key;
  name: string;
  type: string;
  recorded: string;
}

//table colums
const columns: TableColumnsType<DataType> = [
  {
    title: "피보호자",
    dataIndex: "name",
  },
  {
    title: "활동 종류",
    dataIndex: "type",
  },
  {
    title: "기록 시간",
    dataIndex: "recorded",
  },
];

//table dummy data ** 추후 백엔드에서 가져오기
const datalist = [
  { key: 1, name: "lucy", type: "놀이", recorded: "2025.01.12" },
  { key: 2, name: "lucy", type: "놀이", recorded: "2025.01.12" },
  { key: 3, name: "Jack", type: "놀이", recorded: "2025.01.12" },
  { key: 4, name: "Jack", type: "놀이", recorded: "2025.01.12" },
  { key: 5, name: "Jack", type: "놀이", recorded: "2025.01.12" },
  { key: 6, name: "yiminighe", type: "놀이", recorded: "2025.01.12" },
  { key: 7, name: "yiminighe", type: "놀이", recorded: "2025.01.12" },
  { key: 8, name: "yiminighe", type: "놀이", recorded: "2025.01.12" },
];

interface DataTableType {
  key: number;
  name: string;
  type: string;
  recorded: string;
}

//활동기록 > 활동기록 리스트 컴포넌트
const ActivityList = () => {
  //변수 선언
  const router = useRouter();

  //useState
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); //테이블
  const [isModalOpen, setIsModalOpen] = useState(false); //모달 클릭 여부
  const [dataSource, setDataSource] = useState<DataTableType[]>(); //table 행 내용
  const [userName, setUserName] = useState("");

  const adminId = 1;
  const patientId = 1;

  //useEffect
  useEffect(() => {
    //피보호자  전체 리스트
    axiosInstance
      .get("/activity/targetlist", { params: { adminId } })
      .then((res) => {
        console.log("activity targetlist res", res.data);
      })
      .catch((error: string) => {
        console.log("error", error);
      });
    //피보호자 선택에 따른 리스트 가져오기
    // axiosInstance
    //   .get("/activity/selectlist", { params: { adminId, patientId } })
    //   .then((res) => {
    //     console.log("activity targetlist res", res.data);
    //   });

    setDataSource(datalist);
  }, []);

  //antd select handleChange
  const handleChange = (option: { value: number; label: string }) => {
    //console.log("선택한 value:", option.value);
    //console.log("선택한 label:", option.label);
    const matched = datalist.filter((item) => item.name === option.label);

    setDataSource(matched);
  };

  //antd - select option -> ** 추후 백엔드에서 가져와서 표시하기
  const userlist = [
    { value: 1, label: "Jack" },
    { value: 2, label: "lucy" },
    { value: 3, label: "yiminighe" },
  ];

  //기록하기 페이지 이동
  const ActivityWrite = () => {
    router.push("/activity/write/registration");
  };

  //삭제하기 버튼 클릭 이벤트
  const DeleteRows = () => {
    console.log("selectedRowKeys", selectedRowKeys);
  };

  //table checkbox click event
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  //모달 열기
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <ActivityListStyled className={clsx("ActivityList_main_wrap")}>
      {/* 상위 선택 리스트 */}
      <div className="ActivitiyList_status">
        <div className="ActivityList_UserSelect">
          <div>피보호자</div>
          <Select
            className="ActivityList_select"
            defaultValue={{ value: 2, label: "Lucy" }}
            onChange={handleChange}
            options={userlist}
            labelInValue
          />
        </div>
        <div className="ActivityList_btns">
          <Button onClick={ActivityWrite}>기록하기</Button>
          <Button onClick={DeleteRows}>삭제하기</Button>
        </div>
      </div>

      {/* 테이블 */}
      <Table<DataType>
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              //console.log("table row", record, rowIndex);
              setUserName(record.name);
              showModal();
            },
          };
        }}
      />
      <ConfigProvider theme={ActivityTheme}>
        <StyledModal
          width={600}
          title={`${userName}님 활동 기록`}
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <div className="ActivityList_Modal">
            <ActivitySubmit />
          </div>
        </StyledModal>
      </ConfigProvider>
    </ActivityListStyled>
  );
};

export default ActivityList;
