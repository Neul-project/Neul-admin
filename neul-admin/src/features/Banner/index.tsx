import clsx from "clsx";
import { BannerStyled } from "./styled";

// antd
import { Button, Input, Upload, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadProps } from "antd";
import { useFormik } from "formik";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

//배너 등록 컴포넌트
const Banner = () => {
  //useState
  const [arr, setArr] = useState([]);

  useEffect(() => {
    if (arr.length > 1) {
      axiosInstance.get("/banner/list").then((res) => {
        const datalist = res.data;
        const data = res.data[datalist.length - 1].img.split(",");
        setArr(data);
      });
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      leftimg: null as File | null,
      rightimg: null as File | null,
      leftTitle: "",
      rightTitle: "",
    },
    onSubmit: async (values) => {
      //console.log("values", values);
      const formData = new FormData();
      if (values.leftimg) formData.append("img", values.leftimg || arr[0]);
      if (values.rightimg) formData.append("img", values.rightimg || arr[1]);
      formData.append("leftTitle", values.leftTitle);
      formData.append("rightTitle", values.rightTitle);

      //console.log("FormData 내용:", Array.from(formData.entries()));
      //return;

      try {
        await axiosInstance.post("/banner/registration", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        notification.success({
          message: "등록 완료",
          description: "광고가 정상적으로 등록되었습니다.",
        });
      } catch (error) {
        notification.error({
          message: "에러",
          description: "업로드 중 문제가 발생했습니다.",
        });
      }
    },
  });

  const handleUpload = (side: "leftimg" | "rightimg"): UploadProps => ({
    beforeUpload: (file) => {
      formik.setFieldValue(side, file);
      return false;
    },
    maxCount: 1,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <BannerStyled className={clsx("Banner_main_wrap")}>
        {/* 저장 버튼 */}
        <div className="Banner_save">
          <Button htmlType="submit" className="Banner_save_btn">
            저장하기
          </Button>
        </div>

        {/* 미리보기 */}
        <div className="Banner_imgs">
          <div className="Banner_left_img">
            {formik.values.leftimg ? (
              <img
                className="Banner_imgstyle"
                src={URL.createObjectURL(formik.values.leftimg)}
                alt="banner-left"
              />
            ) : arr.length > 0 ? (
              <div>
                <img
                  className="Banner_imgstyle"
                  src={process.env.NEXT_PUBLIC_API_URL + "/uploads/" + arr[0]}
                  alt="왼쪽 이미지"
                />
              </div>
            ) : (
              <div className="Banner_preview_text">미리보기 화면</div>
            )}
          </div>

          <div className="Banner_right_img">
            {formik.values.rightimg ? (
              <img
                className="Banner_imgstyle"
                src={URL.createObjectURL(formik.values.rightimg)}
                alt="banner-right"
              />
            ) : arr.length > 0 ? (
              <div>
                <img
                  className="Banner_imgstyle"
                  src={process.env.NEXT_PUBLIC_API_URL + "/uploads/" + arr[1]}
                  alt="오른쪽 이미지"
                />
              </div>
            ) : (
              <div className="Banner_preview_text">미리보기 화면</div>
            )}
          </div>
        </div>

        {/* 업로드 버튼 */}
        <div className="Banner_btns">
          <Upload {...handleUpload("leftimg")} showUploadList={false}>
            <Button icon={<UploadOutlined />}>좌측 이미지 업로드</Button>
          </Upload>
          <Upload {...handleUpload("rightimg")} showUploadList={false}>
            <Button icon={<UploadOutlined />}>우측 이미지 업로드</Button>
          </Upload>
        </div>

        <div className="Banner_input">
          <Input
            name="left-title"
            placeholder="링크를 입력하시오"
            className="Banner_title"
          />
          <Input
            name="right-title"
            placeholder="링크를 입력하시오"
            className="Banner_title"
          />
        </div>
      </BannerStyled>
    </form>
  );
};

export default Banner;
