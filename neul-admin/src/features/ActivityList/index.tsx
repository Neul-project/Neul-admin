import clsx from "clsx";
import { ActivityListStyled, StyledModal } from "./styled";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";

//antd
import {
  Select,
  Button,
  Table,
  ConfigProvider,
  message,
  Modal,
  notification,
} from "antd";
import type { TableColumnsType, TableProps } from "antd";

//component
import ActivitySubmit from "@/components/ActivitySubmit";
import { useAuthStore } from "@/stores/useAuthStore";
import { formatDate, getActivityLabel } from "@/utill/activityoptionlist";
import { AntdGlobalTheme } from "@/utill/antdtheme";
import { DataTableType, DataType, UserType } from "./datainfo";

type TableRowSelection<T extends object = object> =
  TableProps<T>["rowSelection"];

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
  const [patientId, setPatientId] = useState<number>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); //삭제하기 모달

  //table colums
  const columns: TableColumnsType<DataType> = [
    {
      title: "번호",
      dataIndex: "num",
    },
    {
      title: "피보호자(ID)",
      dataIndex: "name",
    },
    {
      title: "활동 종류",
      dataIndex: "type",
    },
    {
      title: "제목",
      dataIndex: "title",
    },
    {
      title: "기록 시간",
      dataIndex: "recorded",
    },
    {
      title: "상세",
      dataIndex: "detail",
      render: (_: any, record: any) => {
        return (
          <ConfigProvider theme={AntdGlobalTheme}>
            <Button
              onClick={() => {
                //console.log("re", record);
                setUserName(record.name);
                setRowId(record.original);
                setIsModalOpen(true);
              }}
            >
              상세
            </Button>
          </ConfigProvider>
        );
      },
    },
  ];

  //userid useState넣기
  useEffect(() => {
    if (!user?.id) return;
    const adminId = user?.id;
    setAdminId(adminId);
    getTargetlist(adminId);
    //console.log("d", patientId);
    if (patientId) {
      selectlist(patientId);
    } else {
      selectlist();
    }
  }, [user]);

  //타켓 리스트
  const getTargetlist = (adminId: number) => {
    //console.log("ad", adminId);

    //도우미 아이디 따른 피보호자 전체 리스트 가지고 오기
    axiosInstance
      .get("/status/patient", { params: { adminId } })
      .then((res) => {
        //console.log("targetREs", res.data);
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
  };

  //피보호자아이디에 따른 리스트
  const selectlist = (patientId?: number) => {
    //console.log("f", user?.id, patientId);
    axiosInstance
      .get("/activity/selectlist", {
        params: { adminId: user?.id, patientId: patientId },
      })
      .then((res) => {
        //console.log("activity selectlist res", res.data);
        const data = res.data.reverse();

        const mappedData: DataType[] = data?.map(
          (item: any, index: number) => ({
            key: item.id,
            num: index + 1,
            name: item?.patient?.name + "(" + item.patient.id + ")",
            title: item?.title,
            type: getActivityLabel(item?.type),
            recorded: formatDate(item?.recorded_at),
            original: item,
          })
        );

        setDataSource(mappedData);
      });
  };

  //antd select handleChange
  const handleChange = (option: { value: number; label: string }) => {
    //console.log("handle", option.value);
    setPatientId(option.value);
    const patientId = option.value;

    //전체 클릭 시
    if (option.value === 0) {
      selectlist();
    } else {
      //select 선택
      if (!user?.id) return;
      //피보호자 선택에 따른 리스트 가져오기 -> select 피보호자 선택 시
      selectlist(patientId);
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
      notification.error({
        message: "활동기록 삭제 실패",
        description: "삭제할 리스트를 선택해주세요.",
      });
      return;
    } else {
      setIsDeleteModalOpen(true);
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

  //모달 닫기
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  //모달 - 삭제하기 버튼
  const activityDelete = async () => {
    try {
      //console.log("삭제할 리스트 id:", selectedRowKeys);

      //리스트 삭제 요청
      await axiosInstance.delete("/activity/delete", {
        data: { ids: selectedRowKeys },
      });

      setDataSource((prev) =>
        prev?.filter((item) => !selectedRowKeys.includes(item.key))
      );

      notification.success({
        message: "활동기록 삭제",
        description: "선택한 활동기록을 삭제하였습니다.",
      });
      setIsDeleteModalOpen(false);
      setSelectedRowKeys([]);
      selectlist();
    } catch (e) {
      message.error("리스트 삭제에 실패했습니다:");
      //console.error("리스트 삭제 실패: ", e);
    }
  };

  return (
    <ActivityListStyled className={clsx("ActivityList_main_wrap")}>
      {/* 상위 선택 리스트 */}
      <div className="ActivitiyList_status">
        <div className="ActivityList_UserSelect">
          <div>피보호자(ID)</div>
          <ConfigProvider theme={AntdGlobalTheme}>
            <Select
              className="ActivityList_select"
              defaultValue={{ value: 0, label: "전체" }}
              onChange={handleChange}
              options={userlist}
              labelInValue
            />
          </ConfigProvider>
        </div>
        <div className="ActivityList_btns">
          <ConfigProvider theme={AntdGlobalTheme}>
            <Button onClick={ActivityWrite}>기록하기</Button>
            <Button onClick={DeleteRows}>삭제하기</Button>
          </ConfigProvider>
        </div>
      </div>

      {/* 테이블 */}
      <ConfigProvider theme={AntdGlobalTheme}>
        <Table<DataType>
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
        />
      </ConfigProvider>

      {/* 상세모달 */}
      <StyledModal
        width={600}
        zIndex={0}
        key={isModalOpen ? rowid?.[0]?.id : "closed"}
        title={`${userName}님 활동 기록`}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="ActivityList_Modal">
          <ActivitySubmit
            com_type={"modify"}
            rowcontent={rowid}
            setIsModalOpen={setIsModalOpen}
            selectlist={selectlist}
          />
        </div>
      </StyledModal>

      {/* 삭제하기 모달 */}
      <Modal
        width={600}
        title={`활동기록 삭제하기`}
        open={isDeleteModalOpen}
        onCancel={handleCancel}
        footer={
          <>
            <Button onClick={handleCancel}>취소하기</Button>
            <Button type="primary" onClick={activityDelete}>
              삭제하기
            </Button>
          </>
        }
      >
        <div>정말로 삭제하시겠습니까?</div>
      </Modal>
    </ActivityListStyled>
  );
};

export default ActivityList;
