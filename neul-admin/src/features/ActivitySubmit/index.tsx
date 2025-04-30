import { ActivityStyled } from "./styled";
import { useFormik } from "formik";

//antd
import { Input, Upload, message, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

//Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

//활동 기록 등록 컴포넌트 - formik 작성
const ActivitySubmit = () => {
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
        <Input placeholder="제목을 입력하시오" />
        <Upload {...props}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
        <div className="activitySubmit_swiper_div">
          <Swiper
            className="activitySubmit_swiper"
            spaceBetween={50}
            slidesPerView={1}
            onSlideChange={() => console.log("slide change")}
            //onSwiper={(swiper) => console.log(swiper)}
          >
            {arr.map((element) => (
              <SwiperSlide>{element}</SwiperSlide>
            ))}
          </Swiper>
        </div>
      </form>
    </ActivityStyled>
  );
};

export default ActivitySubmit;
