import { useCallback, useEffect, useMemo, useState } from "react";
import { StatusListStyled, StatusTheme, StyledModal } from "./styled";
import { useRouter } from "next/router";
import {
  Button,
  ConfigProvider,
  message,
  notification,
  Select,
  Table,
} from "antd";
import clsx from "clsx";
import axiosInstance from "@/lib/axios";
import StatusWrite from "../../components/StatusWrite";
import dayjs from "dayjs";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePatients } from "@/hooks/usePatients";

type PatientSelectValue = number | "all";

const medicationMap: any = {
  yes: "예",
  no: "아니요",
  none: "없음",
};

const StatusList = () => {
  const [statusList, setStatusList] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] =
    useState<PatientSelectValue>("all");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [modalData, setModalData] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();
  const adminId = useAuthStore((state) => state.user?.id);
  const patientList = usePatients(adminId);

  const mapAndSetStatusList = useCallback((data: any[]) => {
    const mapped = data.map((x: any, i: number) => ({
      key: x.id,
      id: x.id,
      num: i + 1,
      patient: `${x.patient.name}(${x.patient.id})`,
      condition: x.condition,
      medication: medicationMap[x.medication] || "없음",
      recorded_at: dayjs(x.recorded_at).format("YYYY-MM-DD HH:mm:ss"),
      fullData: x,
    }));
    setStatusList(mapped);
  }, []);

  // 전체 리스트라면 patientId가 undefined
  const fetchStatusList = useCallback(
    async (patientId?: number) => {
      try {
        const res = await axiosInstance.get("/status/selectList", {
          params: { adminId, patientId },
        });

        mapAndSetStatusList(res.data);
      } catch (e) {
        console.error("상태 리스트 조회 실패", e);
      }
    },
    [adminId, mapAndSetStatusList]
  );

  useEffect(() => {
    if (!adminId) return;
    fetchStatusList();
  }, [adminId, fetchStatusList]);

  const refetchListBySelectedPatient = useCallback(() => {
    // 전체선택
    if (selectedPatient === "all") {
      fetchStatusList();
    } else {
      // 각 피보호자 선택
      fetchStatusList(Number(selectedPatient));
    }
  }, [selectedPatient, fetchStatusList]);

  useEffect(() => {
    refetchListBySelectedPatient();
  }, [selectedPatient, refetchListBySelectedPatient]);

  // 리스트 삭제
  const WithdrawList = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("삭제할 리스트를 선택해주세요.");
      return;
    }

    try {
      await axiosInstance.delete("/status/delete", {
        data: selectedRowKeys,
      });
      notification.success({
        message: `선택한 상태리스트 삭제 성공`,
        description: `선택한 상태리스트를 삭제했습니다.`,
      });

      setSelectedRowKeys([]);
      refetchListBySelectedPatient();
    } catch (e) {
      notification.error({
        message: `선택한 상태리스트 삭제 실패`,
        description: `선택한 상태리스트 삭제에 실패했습니다.`,
      });
      console.error("리스트 삭제 실패: ", e);
    }
  };

  // 선택된 행
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  // 표 컬럼
  const col = useMemo(
    () => [
      {
        key: "num",
        title: "번호",
        dataIndex: "num",
      },
      {
        key: "patient",
        title: "피보호자(ID)",
        dataIndex: "patient",
      },
      {
        key: "condition",
        title: "컨디션",
        dataIndex: "condition",
      },
      {
        key: "medication",
        title: "약 복용 여부",
        dataIndex: "medication",
      },
      {
        key: "recorded_at",
        title: "기록시간",
        dataIndex: "recorded_at",
      },
      {
        key: "typeBtn",
        title: "상세",
        render: (data: any) => {
          return (
            <Button
              onClick={() => {
                // 수정을 안 했을때 그 내용 유지하도록
                const original = statusList.find(
                  (x) => x.id === data.id
                )?.fullData;

                setModalData(original ? { ...original } : null);
                setModalVisible(true);
              }}
            >
              상세
            </Button>
          );
        },
      },
    ],
    [statusList]
  );

  // 셀렉트 옵션
  const PatientOptions = useMemo(
    () => [
      { label: "전체", value: "all" },
      ...patientList?.map((p) => ({
        label: `${p.name}(${p.patient_id})`,
        value: p.patient_id,
      })),
    ],
    [patientList]
  );

  return (
    <StatusListStyled className={clsx("statuslist_wrap")}>
      <ConfigProvider theme={StatusTheme}>
        <div className="statuslist_box">
          <div className="statuslist_UserSelect">
            <div>피보호자(ID)</div>
            <Select
              className="statuslist_select"
              options={PatientOptions}
              value={selectedPatient}
              onChange={setSelectedPatient}
            />
          </div>
          <div>
            <Button onClick={() => router.push("/statuswrite")}>
              기록하기
            </Button>
            <Button className="statuslist_delete_btn" onClick={WithdrawList}>
              삭제하기
            </Button>
          </div>
        </div>

        <Table
          rowSelection={rowSelection}
          columns={col}
          dataSource={statusList}
          rowKey="id"
        />

        <StyledModal
          open={modalVisible}
          width={600}
          onCancel={() => {
            setModalVisible(false);
            setModalData(null);
          }}
          footer={null}
        >
          <div className="statuslist_modalbox">
            <StatusWrite
              _data={modalData}
              getStatusList={refetchListBySelectedPatient}
              setModalVisible={setModalVisible}
            />
          </div>
        </StyledModal>
      </ConfigProvider>
    </StatusListStyled>
  );
};

export default StatusList;
