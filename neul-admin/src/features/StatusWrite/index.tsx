import { useState } from "react";
import {
  Modal,
  Button,
  Form,
  Radio,
  Select,
  message,
  ConfigProvider,
} from "antd";
import { StatusWriteStyled } from "./styled";
import TextArea from "antd/es/input/TextArea";
import axiosInstance from "@/lib/axios";
import clsx from "clsx";
import TitleCompo from "@/components/TitleCompo";

/* 백엔드에 연결해야하는 거 -> 20번째줄(로그인한 관리자 id와 입력한 데이터를 보냄 post요청) */

// 상태 등록하는 모달
const StatusWrite = () => {
  const [form] = Form.useForm();
  const adminId = 1; //임의 로그인한 관리자 id

  // 로그인한 관리자 id와 입력한 데이터들을 보내 post요청
  const postStatus = async (values: any) => {
    try {
      console.log("등록된 상태:", values);
      await axiosInstance.post("/status", { values, adminId });
      message.success("등록되었습니다.");
      form.resetFields(); // 폼 초기화
    } catch (error) {
      console.error("등록하기 요청 실패:", error);
      message.error("등록에 실패했습니다.");
    }
  };

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
  const name = "홍길동";
  return (
    <StatusWriteStyled className={clsx("statuswrite_page")}>
      <TitleCompo title={`${name}님 상태 등록`} />
      <br />
      <Form form={form} layout="vertical" onFinish={postStatus}>
        <ConfigProvider theme={{ token: { colorPrimary: "#5da487" } }}>
          <Form.Item
            name=""
            label="피보호자"
            rules={[{ required: true, message: "피보호자를 선택해주세요" }]}
          >
            <Select
              options={conditionOptions}
              placeholder="피보호자를 선택해주세요"
            />
          </Form.Item>
        </ConfigProvider>

        {/* 컨디션 */}
        <ConfigProvider theme={{ token: { colorPrimary: "#5da487" } }}>
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
        <ConfigProvider theme={{ token: { colorPrimary: "#5da487" } }}>
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
        <ConfigProvider theme={{ token: { colorPrimary: "#5da487" } }}>
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
        <ConfigProvider theme={{ token: { colorPrimary: "#5da487" } }}>
          <Form.Item
            name="sleep"
            label="수면 시간"
            rules={[{ required: true, message: "수면 시간을 입력해주세요" }]}
          >
            <TextArea placeholder="수면 시간을 입력해주세요" autoSize />
          </Form.Item>
        </ConfigProvider>

        {/* 통증여부 */}
        <ConfigProvider theme={{ token: { colorPrimary: "#5da487" } }}>
          <Form.Item
            name="pain"
            label="통증 여부"
            rules={[{ required: true, message: "통증 여부를 입력해주세요" }]}
          >
            <TextArea placeholder="통증 여부를 입력해주세요" autoSize />
          </Form.Item>
        </ConfigProvider>

        {/* 특이사항 */}
        <ConfigProvider theme={{ token: { colorPrimary: "#5da487" } }}>
          <Form.Item name="note" label="특이사항">
            <TextArea placeholder="특이사항을 입력해주세요" autoSize />
          </Form.Item>
        </ConfigProvider>

        {/* 등록 버튼 */}
        <ConfigProvider theme={{ token: { colorPrimary: "#5da487" } }}>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              등록
            </Button>
          </Form.Item>
        </ConfigProvider>
      </Form>
    </StatusWriteStyled>
  );
};

export default StatusWrite;
