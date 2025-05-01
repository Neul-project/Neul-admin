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
import axiosInstance from "@/lib/axios";

//활동 기록 등록 컴포넌트 - formik 작성
const ActivitySubmit = () => {
  //useState
  const [imgarr, setImgarr] = useState<any[]>([]);

  //파일 업로드
  const props: UploadProps = {
    beforeUpload: () => {
      // 자동 업로드 방지
      return false;
    },

    onChange({ fileList }) {
      setImgarr(fileList); // 파일 리스트 상태 업데이트
      //console.log("url", fileList);
    },
    multiple: true,
    listType: "picture",
    // previewFile: async (file) => {
    //   console.log("Your upload file:", file);

    //   return URL.createObjectURL(file);
    // },
  };

  //swiper array -> 파일 업로드 시 파일 이미지 리스트 나올것
  //const arr = [1, 2, 3, 4, 5];

  //활동 종류 select
  const select_option = [
    { value: "walk", label: "산책" },
    { value: "play", label: "놀이" },
    { value: "exercise", label: "운동" },
  ];

  //피보호자 select -> 추후 백엔드에서 가져올것
  const select_ward = [
    { value: 1, label: "홍길동" },
    { value: 2, label: "김바나나" },
  ];

  //formik
  const activityformik = useFormik({
    initialValues: {
      title: "",
      type: "walk",
      note: "",
    },
    onSubmit: (values) => {
      console.log("values", values);
      const userid = 1; //임시 아이디 (도우미)

      //백엔드 저장 요청
      // axiosInstance
      //   .post(`/activity/write/${userid}`, values)
      //   .then((res) => console.log("/activitiy/write/userid res", res.data));
    },
  });

  return (
    <ActivityStyled>
      <form
        className="activitySubmit_form"
        onSubmit={activityformik.handleSubmit}
      >
        {/* 피보호자 선택 */}
        <div className="activitySubmit_ward">
          <div className="activitySubmit_text">피보호자</div>
          <ConfigProvider theme={ActivityTheme}>
            <Select
              className="activitySubmit_select"
              onChange={(value) =>
                activityformik.setFieldValue("patient_id", value)
              }
              options={select_ward}
            />
          </ConfigProvider>
        </div>
        {/* 제목 */}
        <div className="activitySubmit_title">
          <div className="activitySubmit_text">제목</div>
          <ConfigProvider theme={ActivityTheme}>
            <Input
              name="title"
              value={activityformik.values.title}
              onChange={activityformik.handleChange}
              className="activitySubmit_title_input"
              placeholder="제목을 입력하시오"
            />
          </ConfigProvider>
        </div>

        {/* swiper */}
        <div className="activitySubmit_image">
          <Upload {...props} fileList={imgarr}>
            <Button icon={<UploadOutlined />}>이미지 업로드</Button>
          </Upload>
          <div className="activitySubmit_swiper_div">
            {imgarr.length > 0 ? (
              <>
                <Swiper
                  modules={[Pagination]}
                  className="activitySubmit_swiper"
                  spaceBetween={50}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                  //onSlideChange={() => console.log("slide change")}
                  //onSwiper={(swiper) => console.log(swiper)}
                >
                  {imgarr.map((element: any, index: number) => {
                    if (element.originFileObj) {
                      console.log(URL.createObjectURL(element.originFileObj));
                    }

                    const url = element.originFileObj
                      ? URL.createObjectURL(element.originFileObj)
                      : element.thumbUrl;
                    return (
                      <SwiperSlide key={index}>
                        <img
                          src={url}
                          alt={`preview-${index}`}
                          className="swperimg"
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </>
            ) : (
              <div className="activitySubmit_swiper_text">미리보기</div>
            )}
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
                onChange={(value) =>
                  activityformik.setFieldValue("type", value)
                }
                options={select_option}
              />
            </ConfigProvider>
          </div>

          {/* 재활 치료 */}
          <div>
            <div className="activitySubmit_text">재활 치료</div>

            <ConfigProvider theme={ActivityTheme}>
              <Radio.Group
                onChange={(value) =>
                  activityformik.setFieldValue(
                    "rehabilitation",
                    value.target.value
                  )
                }
              >
                <Radio.Button className="activitySubmit_radio" value="yes">
                  참여
                </Radio.Button>
                <Radio.Button className="activitySubmit_radio" value="no">
                  미참여
                </Radio.Button>
                <Radio.Button className="activitySubmit_radio" value="non">
                  비대상
                </Radio.Button>
              </Radio.Group>
            </ConfigProvider>
          </div>
        </div>

        {/* 특이 사항 */}
        <div>
          <div className="activitySubmit_text">특이 사항</div>
          <ConfigProvider theme={ActivityTheme}>
            <TextArea
              rows={7}
              name="note"
              value={activityformik.values.note}
              onChange={activityformik.handleChange}
            />
          </ConfigProvider>
        </div>

        <div className="activitySubmit_record_div">
          <ConfigProvider theme={ActivityTheme}>
            <Button htmlType="submit" className="activitySubmit_record">
              기록하기
            </Button>
          </ConfigProvider>
        </div>
      </form>
    </ActivityStyled>
  );
};

export default ActivitySubmit;
