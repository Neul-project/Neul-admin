import { useRouter } from "next/router";
import { ProgramlistStyled, StyledModal } from "./styled";
import clsx from "clsx";
import {
  Button,
  Table,
  TableProps,
  Modal,
  ConfigProvider,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import ProgramWrite from "../ProgramWrite";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AntdGlobalTheme } from "@/utill/antdtheme";
import { formatPrice } from "@/utill/programcategory";

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
  //const [filterlst, setFilterlst] = useState();
  const [title, setTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [originlist, setOriginList] = useState([]);
  const [id, setId] = useState();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "번호",
      dataIndex: "num",
      key: "num",
    },
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
          <ConfigProvider theme={AntdGlobalTheme}>
            <Button
              onClick={() => {
                //console.log("re", record.origin);
                setTitle(record.title);
                setOriginList(record.origin);
                setIsModalOpen(true);
                setId(record.id);
              }}
            >
              상세
            </Button>
          </ConfigProvider>
        );
      },
    },
  ];

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    //console.log("selectedRowKeys changed: ", newSelectedRowKeys);
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

    if (selectedRowKeys.length < 1) {
      notification.info({
        message: "삭제할 프로그램을 선택해 주세요",
      });
    } else {
      setIsDeleteModalOpen(true);
    }
  };

  const FooterDelete = () => {
    axiosInstance.delete("/program/delete", {
      data: { ids: selectedRowKeys },
    });

    setList((prev) =>
      prev?.filter((item) => !selectedRowKeys.includes(item.key))
    );
    notification.success({
      message: "삭제되었습니다.",
    });
    setIsDeleteModalOpen(false);
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

  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const getprogramlist = () => {
    axiosInstance.get("/program/list").then((res) => {
      const programList = res.data.map((item: any, index: number) => ({
        num: index + 1,
        key: item.id,
        title: item.name,
        manager: item.manager,
        price: formatPrice(item.price),
        origin: item,
      }));

      setList(programList);
    });
  };

  useEffect(() => {
    getprogramlist();
  }, []);

  return (
    <ProgramlistStyled className={clsx("Programlist_main_wrap")}>
      <div className="Programlist_btns">
        <ConfigProvider theme={AntdGlobalTheme}>
          <Button onClick={ProgramPost}>등록하기</Button>
        </ConfigProvider>

        <ConfigProvider theme={AntdGlobalTheme}>
          <Button onClick={ProgramDelete}>삭제하기</Button>
          <Modal
            title="프로그램 삭제"
            open={isDeleteModalOpen}
            onCancel={() => setIsDeleteModalOpen(false)}
            footer={
              <Button key="back" onClick={FooterDelete}>
                삭제하기
              </Button>
            }
            className="Delete_Modal"
          >
            <div>정말로 삭제하시겠습니까?</div>
          </Modal>
        </ConfigProvider>
        <ConfigProvider theme={AntdGlobalTheme}>
          <Button onClick={execelDowonload}>엑셀 다운받기</Button>
        </ConfigProvider>
      </div>
      <div>
        <Table<DataType>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={list}
        />
        <StyledModal
          title={`${title} 프로그램`}
          key={isModalOpen ? id : "closed"}
          width={600}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <div className="ProgramWrite_Modal">
            <ProgramWrite
              modify={"modify"}
              list={originlist}
              setIsModalOpen={setIsModalOpen}
              getprogramlist={getprogramlist}
            />
          </div>
        </StyledModal>
      </div>
    </ProgramlistStyled>
  );
};

export default Programlist;
