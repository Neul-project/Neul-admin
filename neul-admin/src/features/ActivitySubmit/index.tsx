import { ActivityStyled, ActivityTheme } from "./styled";
import { useFormik } from "formik";

//antd
import {
  Input,
  Upload,
  message,
  Button,
  Select,
  Radio,
  ConfigProvider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, RadioChangeEvent } from "antd";
const { TextArea } = Input;

//Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { useState } from "react";
import { Pagination, A11y } from "swiper/modules";

//활동 기록 등록 컴포넌트 - formik 작성
const ActivitySubmit = () => {
  //useState
  const [imgarr, setImgarr] = useState([""]);

  //파일 업로드
  const props: UploadProps = {
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  //swiper array -> 파일 업로드 시 파일 이미지 리스트 나올것
  const arr = [1, 2, 3, 4, 5];

  //활동 종류 select
  const select_option = [
    { value: "walk", label: "산책" },
    { value: "play", label: "놀이" },
    { value: "exercise", label: "운동" },
  ];

  //라디오버튼
  const onChange = (e: RadioChangeEvent) => {
    console.log(`radio checked:${e.target.value}`);
  };

  //formik
  const activityformik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      console.log("values", values);
    },
  });

  return (
    <ActivityStyled>
      <form
        className="activitySubmit_form"
        onSubmit={activityformik.handleSubmit}
      >
        {/* 제목 */}
        <div className="activitySubmit_title">
          <div className="activitySubmit_text">제목</div>
          <ConfigProvider theme={ActivityTheme}>
            <Input
              className="activitySubmit_title_input"
              placeholder="제목을 입력하시오"
            />
          </ConfigProvider>
        </div>

        {/* swiper */}
        <div className="activitySubmit_image">
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>이미지 업로드</Button>
          </Upload>
          <div className="activitySubmit_swiper_div">
            <Swiper
              modules={[Pagination]}
              className="activitySubmit_swiper"
              spaceBetween={50}
              slidesPerView={1}
              pagination={{ clickable: true }}
              //onSlideChange={() => console.log("slide change")}
              //onSwiper={(swiper) => console.log(swiper)}
            >
              {arr.map((element: any, index: number) => (
                <SwiperSlide key={index}>{element}</SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* 활동종류 & 재활 치료 */}
        <div className="activitySubmit_type">
          {/* 활동종류 */}
          <div>
            <div className="activitySubmit_text">활동 종류</div>
            <ConfigProvider theme={ActivityTheme}>
              <Select
                className="activitySubmit_select"
                defaultValue="walk"
                //onChange={handleChange}
                options={select_option}
              />
            </ConfigProvider>
          </div>

          {/* 재활 치료 */}
          <div>
            <div className="activitySubmit_text">재활 치료</div>
            <div>
              <Radio.Group onChange={onChange}>
                <Radio.Button
                  className="activitySubmit_radio"
                  value="Participation"
                >
                  참여
                </Radio.Button>
                <Radio.Button
                  className="activitySubmit_radio"
                  value="nonParticipation"
                >
                  미참여
                </Radio.Button>
                <Radio.Button
                  className="activitySubmit_radio"
                  value="nonTarget"
                >
                  비대상
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
        </div>

        {/* 특이 사항 */}
        <div>
          <div className="activitySubmit_text">특이 사항</div>
          <ConfigProvider theme={ActivityTheme}>
            <TextArea rows={7} />
          </ConfigProvider>
        </div>

        <div className="activitySubmit_record_div">
          <Button className="activitySubmit_record">기록하기</Button>
        </div>
      </form>
    </ActivityStyled>
  );
};

export default ActivitySubmit;
