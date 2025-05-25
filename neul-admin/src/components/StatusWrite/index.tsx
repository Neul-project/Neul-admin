import { useEffect } from "react";
import { Button, Form, Radio, Select, notification, Input } from "antd";
import { StatusWriteStyled } from "./styled";
import axiosInstance from "@/lib/axios";
import clsx from "clsx";
import TitleCompo from "@/components/TitleCompo";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePatients } from "@/hooks/usePatients";
const { TextArea } = Input;

interface DataProps {
  _data?: any;
  getStatusList?: any;
  setModalVisible?: any;
}

// 상태 등록하는 모달
const StatusWrite = ({ _data, getStatusList, setModalVisible }: DataProps) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const adminId = useAuthStore((state) => state.user?.id);

  // 피보호자 정보 가져오기 (기존 useState + useEffect → usePatients 로 대체)
  const patientList = usePatients(adminId);

  useEffect(() => {
    if (_data) {
      const { meal, patient, ...rest } = _data;
      const [meal1, meal2, meal3] = meal?.split(",") || [];
      form.setFieldsValue({
        patient_id: patient.id,
        patient_name: patient.name,
        ...rest,
        meal1,
        meal2,
        meal3,
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
      await axiosInstance.delete("/status/delete", {
        data: [_data.id],
      });
      notification.success({
        message: `삭제 완료`,
        description: "선택한 리스트를 삭제했습니다.",
      });
      setModalVisible(false); // 모달 닫기
      getStatusList(); //리스트 불러오기
    } catch (e) {
      notification.error({
        message: `삭제 실패`,
        description: "리스트 삭제에 실패했습니다.",
      });
      console.error("리스트 삭제 실패: ", e);
    }
  };

  // 식사량 렌더링
  const renderMealRadioGroup = (name: string, label: string) => (
    <Form.Item
      name={name}
      label={label}
      rules={[{ required: true, message: `${label}을 선택해주세요` }]}
    >
      <Radio.Group optionType="button" buttonStyle="solid">
        {mealOptions.map(({ label, value }) => (
          <Radio.Button key={value} value={value}>
            {label}
          </Radio.Button>
        ))}
      </Radio.Group>
    </Form.Item>
  );

  // 피보호자 정보
  const PatientOptions = patientList.map((item) => ({
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

        {/* 컨디션 */}
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

        {/* 식사량 */}
        {["아침", "점심", "저녁"].map((meal, idx) =>
          renderMealRadioGroup(`meal${idx + 1}`, `${meal} 식사량`)
        )}

        {/* 약 복용 여부 */}
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

        {/* 수면시간 */}
        <Form.Item
          name="sleep"
          label="수면 시간"
          rules={[{ required: true, message: "수면 시간을 입력해주세요" }]}
        >
          <TextArea placeholder="수면 시간을 입력해주세요" autoSize />
        </Form.Item>

        {/* 통증여부 */}
        <Form.Item
          name="pain"
          label="통증 여부"
          rules={[{ required: true, message: "통증 여부를 입력해주세요" }]}
        >
          <TextArea placeholder="통증 여부를 입력해주세요" autoSize />
        </Form.Item>

        {/* 특이사항 */}
        <Form.Item name="note" label="특이사항">
          <TextArea placeholder="특이사항을 입력해주세요" autoSize />
        </Form.Item>

        {/* 등록 버튼 */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {_data ? "수정" : "등록"}
          </Button>
          {_data && (
            <Button
              className="statuswrite_delete_btn"
              onClick={WithdrawList}
              block
            >
              삭제
            </Button>
          )}
        </Form.Item>
      </Form>
    </StatusWriteStyled>
  );
};

export default StatusWrite;
