import { useEffect, useState } from "react";
import { StatusListStyled } from "./styled";
import { useRouter } from "next/router";
import { Button, message, Modal, Select, Table } from "antd";
import clsx from "clsx";
import axiosInstance from "@/lib/axios";
import StatusWrite from "../StatusWrite";
import dayjs from "dayjs";

interface PatientType {
  patient_id: number;
  name: string;
}

// 백엔드랑 연결할거 -> 전체 상태 리스트 불러오는 요청, 선택한 피보호자의 상태 리스트 불러오기, 선택한 리스트 삭제

const dummyPatientData = [
  { patient_id: 1, name: "홍길동" },
  { patient_id: 2, name: "랄라라" },
  { patient_id: 5, name: "헤이헤이" },
];

const dummyStatusData = [
  {
    id: 1,
    patient_id: 1,
    patient_name: "홍길동",
    condition: "좋음",
    medication: "yes",
    meal: ["완식", "대부분 섭취", "절반 섭취"],
    sleep: "7시간",
    pain: "없음",
    note: "기분이 좋아 보임",
    recorded_at: "2025-04-30 09:00",
  },
  {
    id: 2,
    patient_id: 2,
    patient_name: "랄라라",
    condition: "보통",
    medication: "no",
    meal: ["완식", "대부분 섭취", "절반 섭취"],
    sleep: "5시간",
    pain: "두통",
    note: "약을 거부함",
    recorded_at: "2025-04-30 10:30",
  },
  {
    id: 5,
    patient_id: 5,
    patient_name: "헤이헤이",
    condition: "나쁨",
    medication: "none",
    meal: ["완식", "대부분 섭취", "절반 섭취"],
    sleep: "3시간",
    pain: "복통",
    note: "",
    recorded_at: "2025-04-30 11:00",
  },
];

const StatusList = () => {
  const [statusList, setStatusList] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | number>(
    "all"
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [patient, setPatient] = useState<PatientType[]>([]);
  const [modalData, setModalData] = useState<any | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();
  const adminId = 1;

  const medicationMap: any = {
    yes: "예",
    no: "아니요",
    none: "없음",
  };

  const mapAndSetStatusList = (data: any[]) => {
    const mapped = data.map((x: any, i: number) => ({
      key: x.id,
      id: x.id,
      num: i + 1,
      patient: x.patient.name,
      condition: x.condition,
      medication: medicationMap[x.medication] || "없음",
      recorded_at: dayjs(x.recorded_at).format("YYYY-MM-DD HH:mm:ss"),
      fullData: x,
    }));
    setStatusList(mapped);
  };

  // 로그인한 관리자의 담당 피보호자 불러오기(기록하는 페이지에 이미 있는 요청임)
  const getPatient = async () => {
    try {
      // const res = await axiosInstance.get("/status/patient", {
      //   params: { adminId },
      // });

      // // 필요한 데이터로 가공
      // const formatted = res.data.map((item: any) => ({
      //   patient_id: item.id,
      //   name: item.name,
      // }));

      // // 담당 피보호자 id, name저장
      // setPatient(formatted);
      setPatient(dummyPatientData);
    } catch (e) {
      console.error("담당 피보호자 불러오기 실패", e);
    }
  };

  // 전체 상태 리스트 불러오는 요청
  const getStatusList = async () => {
    try {
      const res = await axiosInstance.get("/status/allList", {
        params: {
          adminId,
        },
      });
      mapAndSetStatusList(res.data);
      // mapAndSetStatusList(dummyStatusData);
    } catch (e) {
      console.error("상태 리스트 불러오기 실패", e);
    }
  };

  // 선택한 피보호자의 상태 리스트 불러오기
  const getPatientStatusList = async (patientId: number) => {
    try {
      const res = await axiosInstance.get(`/status/selectList`, {
        params: { adminId, patientId },
      });
      mapAndSetStatusList(res.data);

      // mapAndSetStatusList(dummyStatusData);
    } catch (e) {
      console.error("특정 피보호자 리스트 실패", e);
    }
  };

  useEffect(() => {
    getPatient();
    getStatusList();
  }, []);

  useEffect(() => {
    // 전체 선택시
    if (selectedPatient === "all") {
      getStatusList();
    } else {
      // 각 피보호자 선택시
      getPatientStatusList(Number(selectedPatient));
    }
  }, [selectedPatient]);

  // 리스트 삭제
  const WithdrawList = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("삭제할 리스트를 선택해주세요.");
      return;
    }

    try {
      console.log("삭제할 리스트 id:", selectedRowKeys);
      await axiosInstance.delete("/status/delete", {
        data: selectedRowKeys,
      });

      message.success("선택한 리스트를 삭제했습니다.");
      setSelectedRowKeys([]);
      getStatusList();
    } catch (e) {
      message.error("리스트 삭제에 실패했습니다:");
      console.error("리스트 삭제 실패: ", e);
    }
  };

  // 선택된 행
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  // 표 컬럼
  const col = [
    {
      key: "num",
      title: "번호",
      dataIndex: "num",
    },
    {
      key: "patient",
      title: "피보호자(id)",
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
              // 나중에 요청 다 처리하면 수정할 내용(수정을 안 했을때 그 내용 유지하도록)
              // const original = statusList.find(
              //   (x) => x.id === data.id
              // )?.fullData;

              // setModalData(original ? { ...original } : null);
              setModalData(data?.fullData);
              setModalVisible(true);
            }}
          >
            상세
          </Button>
        );
      },
    },
  ];

  // 셀렉트 옵션
  const PatientOptions = [
    { label: "전체", value: "all" },
    ...patient.map((p) => ({
      label: `${p.name}(${p.patient_id})`,
      value: p.patient_id,
    })),
  ];

  return (
    <StatusListStyled className={clsx("statuslist_wrap")}>
      <div className="statuslist_box">
        <Select
          className="statuslist_select"
          options={PatientOptions}
          value={selectedPatient}
          onChange={setSelectedPatient}
        />
        <div>
          <Button onClick={() => router.push("/statuswrite")}>기록하기</Button>
          <Button onClick={WithdrawList}>삭제</Button>
        </div>
      </div>

      <Table
        rowSelection={rowSelection}
        columns={col}
        dataSource={statusList}
        rowKey="id"
      />

      <Modal
        open={modalVisible}
        width={600}
        onCancel={() => {
          setModalVisible(false);
          setModalData(null);
        }}
        footer={null}
      >
        <div
          style={{
            maxHeight: "70vh",
            minHeight: "300px",
            overflowY: "auto",
            marginTop: "24px",
          }}
        >
          <StatusWrite _data={modalData} />
        </div>
      </Modal>
    </StatusListStyled>
  );
};

export default StatusList;
