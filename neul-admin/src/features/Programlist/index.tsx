import { useRouter } from "next/router";
import { ProgramlistStyled, StyledModal } from "./styled";
import clsx from "clsx";
import { Button, Table, TableProps, Modal } from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import ProgramWrite from "../ProgramWrite";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface DataType {
  key: number;
  title: string;
  manager: string;
  price: number;
  origin: any;
}

//프로그램 리스트 컴포넌트
const Programlist = () => {
  const router = useRouter();

  const [list, setList] = useState<DataType[]>();
  const [filterlst, setFilterlst] = useState();
  const [title, setTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [originlist, setOriginList] = useState([]);

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
    {
      title: "상세",
      dataIndex: "detail",
      render: (_: any, record: any) => {
        return (
          <Button
            onClick={() => {
              //console.log("re", record);
              setTitle(record.title);
              setOriginList(record.origin);
              setIsModalOpen(true);
            }}
          >
            상세
          </Button>
        );
      },
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<DataType> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  //등록하기 버튼 클릭
  const ProgramPost = () => {
    router.push("/program/manage/write");
  };

  //삭제하기 버튼 클릭
  const ProgramDelete = () => {
    //console.log("select", selectedRowKeys);
    axiosInstance.delete("/program/delete", {
      data: { ids: selectedRowKeys },
    });

    setList((prev) =>
      prev?.filter((item) => !selectedRowKeys.includes(item.key))
    );
  };

  //엑셀로 다운받기 클릭
  const execelDowonload = () => {
    //console.log("re", list);
    const excelData =
      list?.map((item) => ({
        프로그램명: item.origin.name,
        카테고리: item.origin.category,
        진행기간: item.origin.progress,
        모집기간: item.origin.recruitment,
        수강료: item.price,
        담당자명: item.origin.manager,
        문의전화: item.origin.call,
        등록일자: item.origin.registration_at,
      })) ?? [];

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "프로그램목록");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "프로그램목록.xlsx");
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
      <div className="Programlist_btns">
        <Button onClick={ProgramPost}>등록하기</Button>
        <Button onClick={ProgramDelete}>삭제하기</Button>
        <Button onClick={execelDowonload}>엑셀 다운받기</Button>
      </div>
      <div>
        <Table<DataType>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={list}
          // onRow={(record, rowIndex) => {
          //   return {
          //     onClick: (event) => {
          //       //console.log("re", record);
          //       showModal();
          //       setTitle(record.title);
          //       setOriginList(record.origin);
          //     },
          //   };
          // }}
        />
        <StyledModal
          title={`${title} 프로그램`}
          width={600}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <div className="ProgramWrite_Modal">
            <ProgramWrite modify={"modify"} list={originlist} />
          </div>
        </StyledModal>
      </div>
    </ProgramlistStyled>
  );
};

export default Programlist;
