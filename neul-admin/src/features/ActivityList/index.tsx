import clsx from "clsx";
import { ActivityListStyled } from "./styled";
import { useRouter } from "next/router";

//antd
import { Select, Button, Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { useState } from "react";

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
const dataSource = Array.from({ length: 10 }).map<DataType>((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  type: "놀이",
  recorded: `London, Park Lane no. ${i}`,
}));

//활동기록 > 활동기록 리스트 컴포넌트
const ActivityList = () => {
  //변수 선언
  const router = useRouter();

  //useState
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  //antd select handleChange
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  //antd - select option -> ** 추후 백엔드에서 가져와서 표시하기
  const userlist = [
    { value: 1, label: "Jack" },
    { value: 2, label: "Lucy" },
    { value: 3, label: "yiminghe" },
    { value: 4, label: "Disabled" },
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

  return (
    <ActivityListStyled className={clsx("ActivityList_main_wrap")}>
      {/* 상위 선택 리스트 */}
      <div className="ActivitiyList_status">
        <div className="ActivityList_UserSelect">
          <div>피보호자</div>
          <Select
            className="ActivityList_select"
            defaultValue="lucy"
            onChange={handleChange}
            options={userlist}
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
      />
    </ActivityListStyled>
  );
};

export default ActivityList;
