import clsx from "clsx";
import { BannerStyled } from "./styled";

//antd
import { Button, Upload, message, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { useState } from "react";
import axiosInstance from "@/lib/axios";

//배너 광고 등록 컴포넌트
const Banner = () => {
  //useState
  const [leftimg, setLeftImg] = useState<string>("");
  const [rightimg, setRightImg] = useState<string>("");

  //좌측 이미지 미리보기
  const propsleft: UploadProps = {
    beforeUpload: () => {
      // 자동 업로드 방지
      return false;
    },
    onChange({ fileList }) {
      const url = fileList[0].originFileObj
        ? URL.createObjectURL(fileList[0].originFileObj)
        : fileList[0].thumbUrl || "";

      setLeftImg(url); // 파일 리스트 상태 업데이트
      //console.log("url", fileList);
    },
    maxCount: 1,
  };

  //우측 이미지 미리보기
  const propsright: UploadProps = {
    beforeUpload: () => {
      // 자동 업로드 방지
      return false;
    },
    onChange({ fileList }) {
      const url = fileList[0].originFileObj
        ? URL.createObjectURL(fileList[0].originFileObj)
        : fileList[0].thumbUrl || "";

      setRightImg(url); // 파일 리스트 상태 업데이트
    },
    maxCount: 1,
  };

  //저장하기 버튼 클릭 함수
  const saveimg = () => {
    axiosInstance
      .post(
        `/banner/registration`,
        {
          leftimg,
          rightimg,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        notification.success({
          message: "등록 완료",
          description: "광고가 정상적으로 등록되었습니다.",
        });
      });
  };

  return (
    <BannerStyled className={clsx("Banner_main_wrap")}>
      <h1 className="Banner_title">배너 광고 등록하기</h1>

      {/* 미리보기 화면 */}
      <div className="Banner_imgs">
        <div className="Banner_left_img">
          {leftimg ? (
            <img className="Banner_imgstyle" src={leftimg} alt="banner-1" />
          ) : (
            <div className="Banner_preview_text">미리보기 화면</div>
          )}
        </div>
        <div className="Banner_right_img">
          {rightimg ? (
            <img className="Banner_imgstyle" src={rightimg} alt="banner-2" />
          ) : (
            <div className="Banner_preview_text">미리보기 화면</div>
          )}
        </div>
      </div>

      {/* 이미지 등록하기 */}
      <div className="Banner_btns">
        <Upload {...propsleft}>
          <Button icon={<UploadOutlined />}>이미지 업로드</Button>
        </Upload>
        <Upload {...propsright}>
          <Button icon={<UploadOutlined />}>이미지 업로드</Button>
        </Upload>
      </div>

      <div className="Banner_save">
        <Button onClick={saveimg}>저장하기</Button>
      </div>
    </BannerStyled>
  );
};

export default Banner;
