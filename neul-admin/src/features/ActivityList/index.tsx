import clsx from "clsx";
import { ActivityListStyled, ActivityTheme, StyledModal } from "./styled";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

//antd
import { Select, Button, Table, Modal, ConfigProvider, message } from "antd";
import type { TableColumnsType, TableProps } from "antd";

//component
import ActivitySubmit from "@/components/ActivitySubmit";
import { useAuthStore } from "@/stores/useAuthStore";
import { getActivityLabel } from "@/utill/activityoptionlist";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

interface DataType {
  key: number;
  name: string;
  type: string;
  recorded: string;
  original?: any;
}

//테이블 데이터 타입
interface DataTableType {
  key: number;
  name: string;
  type: string;
  recorded: string;
  original?: any;
}

//유저 데이터 타입
interface UserType {
  value: number;
  label: string;
}

//table colums
const columns: TableColumnsType<DataType> = [
  {
    title: "피보호자(ID)",
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

//활동기록 > 활동기록 리스트 컴포넌트
const ActivityList = () => {
  //변수 선언
  const router = useRouter();
  const { user } = useAuthStore();

  //useState
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]); //테이블
  const [isModalOpen, setIsModalOpen] = useState(false); //모달 클릭 여부
  const [dataSource, setDataSource] = useState<DataTableType[]>(); //table 행 내용
  const [userName, setUserName] = useState("");
  const [userlist, setUserlist] = useState<UserType[]>();
  const [rowid, setRowId] = useState<any[]>(); //테이블 행 클릭 시 아이디(select요청 id와 비교할 때 사용)
  const [adminId, setAdminId] = useState<number | null>(); //관리자id(===로그인한 userid)

  //userid useState넣기
  useEffect(() => {
    if (user?.id) {
      setAdminId(user.id);
    }
  }, [user]);

  useEffect(() => {
    //if (!user?.id) return;

    //도우미 id에 따른 활동기록 전체 가져오기
    axiosInstance
      .get("/activity/selectlistall", { params: { adminId } })
      .then((res) => {
        //console.log("activity targetlist res", res.data);
        const data = res.data;
        const mappedData: DataType[] = data.map((item: any, index: number) => ({
          key: item.id,
          name: item.patient.name + "(" + item.patient.id + ")" ?? "",
          type: getActivityLabel(item.type ?? ""),
          recorded: item.recorded_at ?? "",
          original: item,
        }));
        setDataSource(mappedData);
      });
  }, []);

  useEffect(() => {
    if (!user?.id) return;

    //도우미 아이디 피보호자 전체 리스트 가지고 오기
    axiosInstance
      .get("/activity/targetlist", { params: { adminId } })
      .then((res) => {
        //console.log("REs", res.data);
        const data = res.data;
        const mappedDate: UserType[] = data.map((item: any, index: number) => ({
          key: item.id,
          value: item.id,
          label: item.name + "(" + item.id + ")",
        }));
        const withAllOption: UserType[] = [
          { value: 0, label: "전체" },
          ...mappedDate,
        ];
        setUserlist(withAllOption);
      });
  }, [user]);

  //antd select handleChange
  const handleChange = (option: { value: number; label: string }) => {
    //console.log("선택한 value:", option.value);
    //console.log("선택한 label:", option.label);
    const patientId = option.value;
    //setPatientId(option.value); //피보호자 선택

    //전체 클릭 시
    if (option.value === 0) {
      if (!user?.id) return;
      //피보호자  전체 리스트 ->select 전체 선택 시
      axiosInstance
        .get("/activity/selectlistall", { params: { adminId } })
        .then((res) => {
          //console.log("activity targetlist res", res.data);
          const data = res.data;
          const mappedData: DataType[] = data.map(
            (item: any, index: number) => ({
              key: item.id ?? index,
              name: item.patient.name + "(" + item.patient.id + ")" ?? "",
              type: getActivityLabel(item.type ?? ""),
              recorded: item.recorded_at ?? "",
              original: item,
            })
          );
          setDataSource(mappedData);
        })
        .catch((error: string) => {
          //console.log("error", error);
        });
    } else {
      //select 선택
      if (!user?.id) return;
      //피보호자 선택에 따른 리스트 가져오기 -> select 피보호자 선택 시

      //console.log("ad", adminId, patientId);
      axiosInstance
        .get("/activity/selectlist", { params: { adminId, patientId } })
        .then((res) => {
          //console.log("activity selectlist res", res.data);
          const data = res.data;

          const mappedData: DataType[] = data.map(
            (item: any, index: number) => ({
              key: item.id ?? index,
              name: item.patient.name + "(" + item.patient.id + ")" ?? "",
              type: getActivityLabel(item.type ?? ""),
              recorded: item.recorded_at ?? "",
              original: item,
            })
          );

          setDataSource(mappedData);
        });
    }
  };

  //기록하기 페이지 이동
  const ActivityWrite = () => {
    router.push("/activity/write/registration");
  };

  //삭제하기 버튼 클릭 이벤트
  const DeleteRows = async () => {
    //console.log("selectedRowKeys", selectedRowKeys);
    if (selectedRowKeys.length === 0) {
      message.warning("삭제할 리스트를 선택해주세요.");
      return;
    }

    try {
      console.log("삭제할 리스트 id:", selectedRowKeys);

      //리스트 삭제 요청
      await axiosInstance.delete("/activity/delete", {
        data: { ids: selectedRowKeys },
      });

      message.success("선택한 리스트를 삭제했습니다.");
      setSelectedRowKeys([]);
    } catch (e) {
      message.error("리스트 삭제에 실패했습니다:");
      console.error("리스트 삭제 실패: ", e);
    }
  };

  //table checkbox click event
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    //console.log("selectedRowKeys changed: ", newSelectedRowKeys);
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
          <div>피보호자(ID)</div>
          <Select
            className="ActivityList_select"
            defaultValue={{ value: 0, label: "전체" }}
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

              const matchedRow = dataSource?.find(
                (item) => item.key === record.key
              );
              //console.log("tie", matchedRow);
              if (matchedRow?.original) {
                setRowId(matchedRow.original);
              }
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
            <ActivitySubmit com_type={"modify"} rowcontent={rowid} />
          </div>
        </StyledModal>
      </ConfigProvider>
    </ActivityListStyled>
  );
};

export default ActivityList;
