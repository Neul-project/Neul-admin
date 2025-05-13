import { useRouter } from "next/router";
import { ProgramlistStyled } from "./styled";
import clsx from "clsx";
import { Button, Table, TableProps, Modal } from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import ProgramWrite from "../ProgramWrite";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface DataType {
  key: number;
  title: string;
  manager: string;
  price: number;
  origin: any;
}

const columns: TableProps<DataType>["columns"] = [
  {
    title: "프로그램명",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "담당자",
    dataIndex: "manager",
    key: "manager",
  },
  {
    title: "가격",
    dataIndex: "price",
    key: "price",
  },
];

//프로그램 리스트 컴포넌트
const Programlist = () => {
  const router = useRouter();

  const [list, setList] = useState<DataType[]>();
  const [filterlst, setFilterlst] = useState();
  const [title, setTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [originlist, setOriginList] = useState([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const ProgramPost = () => {
    router.push("/program/manage/write");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    axiosInstance.get("/program/list").then((res) => {
      const programList = res.data.map((item: any, index: number) => ({
        key: item.id,
        title: item.name,
        manager: item.manager,
        price: item.price,
        origin: item,
      }));

      setList(programList);
    });
  }, []);

  return (
    <ProgramlistStyled className={clsx("Programlist_main_wrap")}>
      <div className="Programlist_execl">
        <Button>엑셀로 다운받기</Button>
      </div>
      <div className="Programlist_btns">
        <Button onClick={ProgramPost}>등록하기</Button>
        <Button>삭제하기</Button>
      </div>
      <div>
        <Table<DataType>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={list}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                //console.log("re", record);
                showModal();
                setTitle(record.title);
                setOriginList(record.origin);
              },
            };
          }}
        />
        <Modal
          title={`${title} 프로그램`}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <ProgramWrite modify={"modify"} list={originlist} />
        </Modal>
      </div>
    </ProgramlistStyled>
  );
};

export default Programlist;
