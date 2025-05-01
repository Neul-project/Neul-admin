import { useEffect, useMemo, useState } from "react";
import { StatusListStyled } from "./styled";
import { useRouter } from "next/router";
import { Button, message, Select, Table } from "antd";
import axiosInstance from "@/lib/axios";
import clsx from "clsx";

interface PatientType {
  patient_id: number;
  name: string;
}

const StatusList = () => {
  const [statusList, setStatusList] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | number>(
    "all"
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [patient, setPatient] = useState<PatientType[]>([]);
  const router = useRouter();

  const adminId = 1;

  const dummydata = [
    {
      patient_id: 1,
      name: "홍길동",
    },
    {
      patient_id: 2,
      name: "랄라라",
    },
    {
      patient_id: 5,
      name: "헤이헤이",
    },
  ];

  // 로그인한 관리자의 담당 피보호자 불러오기(이미 있는 요청임)
  const getPatient = async () => {
    try {
      // const res = await axiosInstance.get("/status/patient", {
      //   params: { adminId },
      // });
      // setPatient(res.data);
      setPatient(dummydata);
    } catch (e) {}
  };

  useEffect(() => {
    getPatient();
  }, []);

  const getStatusList = async () => {
    try {
      // 전체 상태 리스트 불러오는 get 요청
      const res = await axiosInstance.get("/status/list", {
        params: {
          adminId,
        },
      });
      const data = res.data;

      console.log(data);

      const mapped = data.map((x: any) => ({
        key: x.id,
        id: x.id,
        email: x.email,
        user: x.name || x.nickname || "이름 없음",
        phone: x.phone || "전화번호 없음",
        report_count: x.report_count || 0,
        status: x.status,
        user_type: x.user_type,
      }));

      setStatusList(mapped);
    } catch (e) {
      console.error("상태 리스트 불러오기 실패", e);
    }
  };

  // 상태정보
  useEffect(() => {
    getStatusList();
  }, []);

  // 리스트삭제
  const WithdrawList = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("삭제할 리스트를 선택해주세요.");
      return;
    }

    try {
      await axiosInstance.delete("/status/delete", {
        data: { userIds: selectedRowKeys },
      });
      message.success("선택한 리스트를 완전히 삭제했습니다.");
      getStatusList(); // 목록 다시 불러오기
      setSelectedRowKeys([]); // 선택 초기화
    } catch (err) {
      console.error("리스트 삭제 실패:", err);
      message.error("리스트 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  // 테이블 rowSelection 설정
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  // 컬럼
  const col: any = [
    {
      key: "num",
      title: "번호",
      dataIndex: "num",
    },
    {
      key: "patient",
      title: "피보호자",
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
  ];

  const list = useMemo(() => {
    return statusList.map((x: any, i: number) => ({
      num: i + 1,
      key: x?.id,
      id: x?.id,
      patient: x?.patient,
      condition: x?.condition,
      medication: x?.medication,
      recorded_at: x?.recorded_at,
    }));
  }, []);

  // 피보호자 정보
  const PatientOptions = [
    { label: "전체", value: "all" },
    ...patient.map((patient) => ({
      label: patient.name,
      value: patient.patient_id,
    })),
  ];

  return (
    <StatusListStyled className={clsx("statuslist_wrap")}>
      <div className="statuslist_box">
        <Select
          options={PatientOptions}
          value={selectedPatient}
          onChange={(value) => setSelectedPatient(value)}
        />
        <div>
          <Button
            onClick={() => {
              router.push("/statuswrite");
            }}
          >
            기록하기
          </Button>
          <Button onClick={WithdrawList}>삭제</Button>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={col}
        dataSource={list}
        rowKey="id"
      />
    </StatusListStyled>
  );
};

export default StatusList;
