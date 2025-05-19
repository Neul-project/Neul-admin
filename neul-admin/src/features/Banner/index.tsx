import clsx from "clsx";
import { BannerStyled } from "./styled";
import { getMimeType } from "@/utill/imagemimetype";
import { useFormik } from "formik";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import { AntdGlobalTheme } from "@/utill/antdtheme";

// antd
import { Button, Input, Upload, notification, ConfigProvider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadProps } from "antd";
import { bannerValidationSchema } from "@/utill/bannerValidation";

//배너 등록 컴포넌트
const Banner = () => {
  //useState
  const [arr, setArr] = useState([]);
  // const [url, setUrl] = useState([]);

  useEffect(() => {
    //axiosInstance.get("/banner/list").then((res) => {
    //const datalist = res.data;
    //console.log("datalist", datalist);
    //const data = res.data[datalist.length - 1].img.split(",");
    //const urldata = res.data[datalist.length - 1].url.split(",");
    //setArr(data);
    //setUrl(urldata);
    //console.log("data", data);
    //});
  }, []);

  const formik = useFormik({
    initialValues: {
      leftimg: null as File | null,
      rightimg: null as File | null,
      lefturl: "",
      righturl: "",
    },
    validationSchema: bannerValidationSchema,
    onSubmit: async (values) => {
      //console.log("values", values);

      const formData = new FormData();

      if (values.leftimg) formData.append("img", values.leftimg);
      if (values.rightimg) formData.append("img", values.rightimg);

      formData.append("lefturl", values.lefturl);
      formData.append("righturl", values.righturl);

      //console.log("FormData 내용:", Array.from(formData.entries()));

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
          <ConfigProvider theme={AntdGlobalTheme}>
            <Button htmlType="submit" className="Banner_save_btn">
              저장하기
            </Button>
          </ConfigProvider>
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
                  src={
                    process.env.NEXT_PUBLIC_API_URL + "/uploads/image/" + arr[0]
                  }
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
                  src={
                    process.env.NEXT_PUBLIC_API_URL + "/uploads/image/" + arr[1]
                  }
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
          <ConfigProvider theme={AntdGlobalTheme}>
            <div className="Banner_btn">
              <Upload {...handleUpload("leftimg")} showUploadList={false}>
                <Button icon={<UploadOutlined />}>이미지 업로드</Button>
              </Upload>
              {formik.touched.leftimg && formik.errors.leftimg && (
                <div className="Banner_error">{formik.errors.leftimg}</div>
              )}
            </div>
            <div>
              <Upload {...handleUpload("rightimg")} showUploadList={false}>
                <Button icon={<UploadOutlined />}>이미지 업로드</Button>
              </Upload>
              {formik.touched.rightimg && formik.errors.rightimg && (
                <div className="Banner_error">{formik.errors.rightimg}</div>
              )}
            </div>
          </ConfigProvider>
        </div>

        <div className="Banner_inputs">
          <ConfigProvider theme={AntdGlobalTheme}>
            <div className="Banner_input">
              <Input
                name="lefturl"
                placeholder="링크를 입력하시오"
                className="Banner_title"
                value={formik.values.lefturl}
                onChange={formik.handleChange}
              />
              {formik.touched.lefturl && formik.errors.lefturl && (
                <div style={{ color: "red", marginTop: 4 }}>
                  {formik.errors.lefturl}
                </div>
              )}
            </div>
            <div className="Banner_input">
              <Input
                name="righturl"
                placeholder="링크를 입력하시오"
                className="Banner_title"
                value={formik.values.righturl}
                onChange={formik.handleChange}
              />
              {formik.touched.righturl && formik.errors.righturl && (
                <div style={{ color: "red", marginTop: 4 }}>
                  {formik.errors.righturl}
                </div>
              )}
            </div>
          </ConfigProvider>
        </div>
      </BannerStyled>
    </form>
  );
};

export default Banner;
