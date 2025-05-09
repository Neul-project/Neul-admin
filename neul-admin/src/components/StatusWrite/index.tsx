import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Radio,
  Select,
  ConfigProvider,
  notification,
  Input,
  message,
} from "antd";
import { StatusTheme, StatusWriteStyled } from "./styled";
import axiosInstance from "@/lib/axios";
import clsx from "clsx";
import TitleCompo from "@/components/TitleCompo";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/useAuthStore";
const { TextArea } = Input;

interface PatientType {
  patient_id: number;
  name: string;
}

interface DataProps {
  _data?: any;
  getStatusList?: any;
  setModalVisible?: any;
}

const dummyPatientData = [
  { patient_id: 1, name: "홍길동" },
  { patient_id: 2, name: "랄라라" },
  { patient_id: 5, name: "헤이헤이" },
];

// 상태 등록하는 모달
const StatusWrite = ({ _data, getStatusList, setModalVisible }: DataProps) => {
  const [form] = Form.useForm();
  const [patient, setPatient] = useState<PatientType[]>([]);
  const router = useRouter();
  const adminId = useAuthStore((state) => state.user?.id);

  // 로그인한 관리자의 담당 피보호자 불러오기
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
      console.error("담당 피보호자 불러오기 실패: ", e);
    }
  };

  useEffect(() => {
    getPatient();
  }, []);

  useEffect(() => {
    if (_data) {
      const { meal, patient, ...rest } = _data;
      console.log(patient);
      form.setFieldsValue({
        patient_id: patient.id,
        patient_name: patient.name,
        ...rest,
        meal1: meal?.split(",")[0],
        meal2: meal?.split(",")[1],
        meal3: meal?.split(",")[2],
      });
    }
  }, [_data, form]);

  // 로그인한 관리자 id와 입력한 데이터들을 보내 post요청
  const postStatus = async (values: any) => {
    try {
      const { meal1, meal2, meal3, ...rest } = values;

      const formatValues = {
        ...rest,
        meal: [meal1, meal2, meal3],
      };

      console.log("등록된 상태:", formatValues);

      if (_data) {
        // 수정(해당 리스트의 id)
        await axiosInstance.put(`/status/update/${_data?.id}`, {
          formatValues,
          adminId,
        });
        setModalVisible(false);
        getStatusList();
      } else {
        // 등록
        await axiosInstance.post("/status/write", { formatValues, adminId });
        form.resetFields(); // 폼 초기화
        router.push("/status");
      }

      notification.success({
        message: `${_data ? "수정" : "등록"} 완료`,
        description: `상태가 성공적으로 ${
          _data ? "수정" : "등록"
        } 완료 되었습니다.`,
      });
    } catch (e) {
      console.error(`${_data ? "수정" : "등록"}하기 요청 실패:`, e);
      notification.error({
        message: `${_data ? "수정" : "등록"} 실패`,
        description: `상태 ${
          _data ? "수정" : "등록"
        }에 실패했습니다. 다시 시도해주세요.`,
      });
    }
  };

  // 해당 리스트 삭제
  const WithdrawList = async () => {
    try {
      console.log("삭제할 리스트 id:", _data.id);
      await axiosInstance.delete("/status/delete", {
        data: _data.id,
      });
      message.success("선택한 리스트를 삭제했습니다.");
      setModalVisible(false); // 모달 닫기
      getStatusList(); //리스트 불러오기
    } catch (e) {
      message.error("리스트 삭제에 실패했습니다.");
      console.error("리스트 삭제 실패: ", e);
    }
  };

  // 피보호자 정보
  const PatientOptions = patient.map((item) => ({
    label: `${item.name}(${item.patient_id})`,
    value: item.patient_id,
  }));

  // 컨디션
  const conditionOptions = [
    { label: "아주 좋음", value: "아주 좋음" },
    { label: "좋음", value: "좋음" },
    { label: "보통", value: "보통" },
    { label: "나쁨", value: "나쁨" },
    { label: "아주 나쁨", value: "아주 나쁨" },
  ];

  // 식사량
  const mealOptions = [
    { label: "완식", value: "완식" },
    { label: "대부분 섭취", value: "대부분 섭취" },
    { label: "절반 섭취", value: "절반 섭취" },
    { label: "조금 섭취", value: "조금 섭취" },
    { label: "식사 거부", value: "식사 거부" },
  ];

  return (
    <StatusWriteStyled className={clsx("statuswrite_wrap")}>
      <Form form={form} layout="vertical" onFinish={postStatus}>
        <TitleCompo
          title={_data ? `${_data?.patient.name}님의 상태 상세` : "상태 기록"}
        />
        <br />
        <ConfigProvider theme={StatusTheme}>
          <Form.Item
            name="patient_id"
            label="피보호자"
            rules={[{ required: true, message: "피보호자를 선택해주세요" }]}
          >
            <Select
              disabled={_data ? true : false}
              options={PatientOptions}
              placeholder="피보호자를 선택해주세요"
            />
          </Form.Item>
        </ConfigProvider>

        {/* 컨디션 */}
        <ConfigProvider theme={StatusTheme}>
          <Form.Item
            name="condition"
            label="컨디션"
            rules={[{ required: true, message: "컨디션을 선택해주세요" }]}
          >
            <Select
              options={conditionOptions}
              placeholder="컨디션을 선택해주세요"
            />
          </Form.Item>
        </ConfigProvider>

        {/* 식사량 */}
        <ConfigProvider theme={StatusTheme}>
          {["아침 식사량", "점심 식사량", "저녁 식사량"].map((meal, i) => (
            <Form.Item
              key={i}
              name={`meal${i + 1}`}
              label={meal}
              rules={[
                { required: true, message: `${meal} 식사량을 선택해주세요` },
              ]}
            >
              <Radio.Group optionType="button" buttonStyle="solid">
                {mealOptions.map((option, idx) => (
                  <Radio.Button key={idx} value={option.value}>
                    {option.label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Form.Item>
          ))}
        </ConfigProvider>

        {/* 약 복용 여부 */}
        <ConfigProvider theme={StatusTheme}>
          <Form.Item
            name="medication"
            label="약 복용 여부"
            rules={[{ required: true, message: "복용 여부를 선택해주세요" }]}
          >
            <Radio.Group optionType="button" buttonStyle="solid">
              <Radio.Button value="yes">예</Radio.Button>
              <Radio.Button value="no">아니요</Radio.Button>
              <Radio.Button value="none">없음</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </ConfigProvider>

        {/* 수면시간 */}
        <ConfigProvider theme={StatusTheme}>
          <Form.Item
            name="sleep"
            label="수면 시간"
            rules={[{ required: true, message: "수면 시간을 입력해주세요" }]}
          >
            <TextArea placeholder="수면 시간을 입력해주세요" autoSize />
          </Form.Item>
        </ConfigProvider>

        {/* 통증여부 */}
        <ConfigProvider theme={StatusTheme}>
          <Form.Item
            name="pain"
            label="통증 여부"
            rules={[{ required: true, message: "통증 여부를 입력해주세요" }]}
          >
            <TextArea placeholder="통증 여부를 입력해주세요" autoSize />
          </Form.Item>
        </ConfigProvider>

        {/* 특이사항 */}
        <ConfigProvider theme={StatusTheme}>
          <Form.Item name="note" label="특이사항">
            <TextArea placeholder="특이사항을 입력해주세요" autoSize />
          </Form.Item>
        </ConfigProvider>

        {/* 등록 버튼 */}
        <ConfigProvider theme={StatusTheme}>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {_data ? "수정" : "등록"}
            </Button>
            {_data ? (
              <Button
                className="statuswrite_delete_btn"
                onClick={WithdrawList}
                block
              >
                삭제
              </Button>
            ) : (
              <></>
            )}
          </Form.Item>
        </ConfigProvider>
      </Form>
    </StatusWriteStyled>
  );
};

export default StatusWrite;
