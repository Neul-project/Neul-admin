import clsx from "clsx";
import { BannerStyled } from "./styled";

// antd
import { Button, Input, Upload, notification, ConfigProvider } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadProps } from "antd";
import { useFormik } from "formik";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import { AntdGlobalTheme } from "@/utill/antdtheme";

//배너 등록 컴포넌트
const Banner = () => {
  //useState
  const [arr, setArr] = useState([]);
  const [url, setUrl] = useState([]);

  useEffect(() => {
    axiosInstance.get("/banner/list").then((res) => {
      const datalist = res.data;
      //console.log("datalist", datalist);
      const data = res.data[datalist.length - 1].img.split(",");
      const urldata = res.data[datalist.length - 1].url.split(",");
      setArr(data);
      setUrl(urldata);
      //console.log("d", data);
    });
  }, []);

  const formik = useFormik({
    initialValues: {
      leftimg: null as File | null,
      rightimg: null as File | null,
      lefturl: "",
      righturl: "",
    },
    onSubmit: async (values) => {
      console.log("values", values);
      const formData = new FormData();
      if (values.leftimg) formData.append("img", values.leftimg || arr[0]);
      if (values.rightimg) formData.append("img", values.rightimg || arr[1]);
      formData.append("lefturl", values.lefturl || url[0]);
      formData.append("righturl", values.righturl || url[1]);

      // console.log("FormData 내용:", Array.from(formData.entries()));
      // return;

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
            <Upload {...handleUpload("leftimg")} showUploadList={false}>
              <Button icon={<UploadOutlined />}>좌측 이미지 업로드</Button>
            </Upload>
            <Upload {...handleUpload("rightimg")} showUploadList={false}>
              <Button icon={<UploadOutlined />}>우측 이미지 업로드</Button>
            </Upload>
          </ConfigProvider>
        </div>

        <div className="Banner_input">
          <ConfigProvider theme={AntdGlobalTheme}>
            <Input
              name="lefturl"
              placeholder="링크를 입력하시오"
              className="Banner_title"
              value={formik.values.lefturl || url[0]}
              onChange={formik.handleChange}
            />
            <Input
              name="righturl"
              placeholder="링크를 입력하시오"
              className="Banner_title"
              value={formik.values.righturl || url[1]}
              onChange={formik.handleChange}
            />
          </ConfigProvider>
        </div>
      </BannerStyled>
    </form>
  );
};

export default Banner;
