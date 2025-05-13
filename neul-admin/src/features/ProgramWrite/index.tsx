import { ProgramWriteStyled } from "./styled";
import { useFormik } from "formik";

//antd
import { Button, Input, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

//categroylist
import { categorylist } from "@/utill/programcategory";
import { useState } from "react";
import axiosInstance from "@/lib/axios";
import clsx from "clsx";

//프로그램 등록 컴포넌트
const ProgramWrite = (props: { modify: string; list: any }) => {
  const { modify, list } = props;
  //useState
  //const [imgarr, setImgArr] = useState<any[]>();

  //antd selects handleChange 함수
  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
    programformik.setFieldValue("category", value);
  };

  const imageprops: UploadProps = {
    beforeUpload: (file) => {
      // 업로드를 막고, formik에만 넣기
      programformik.setFieldValue("img", [...programformik.values.img, file]);
      return false;
    },

    onChange(info) {
      console.log("info.fileList", info.fileList);
      //setImgArr(info.fileList);
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    multiple: true,
    maxCount: 5,
  };

  const programformik = useFormik({
    initialValues: {
      name: "",
      progress: "",
      category: "",
      recruitment: "",
      price: "",
      manager: "",
      capacity: "",
      call: "",
      img: [],
    },
    onSubmit: (values) => {
      console.log("Values", values);
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("progress", values.progress);
      formData.append("recruitment", values.recruitment);
      formData.append("price", values.price);
      formData.append("manager", values.manager);
      formData.append("capacity", values.capacity);
      formData.append("call", values.call);
      formData.append("category", values.category.toString());

      // img 배열 처리
      values.img.forEach((file: File, index: number) => {
        formData.append("img", file);
      });

      //프로그램 등록 요청
      axiosInstance
        .post(`/program/registration`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((res) => {
          console.log("등록 성공", res);
        });
    },
  });

  return (
    <ProgramWriteStyled className={clsx("ProgramWrite_main_wrap")}>
      <div className="ProgramWrite_h3">
        <h3>프로그램 등록 페이지</h3>
      </div>

      <form onSubmit={programformik.handleSubmit}>
        <div className="ProgramWrite_submit">
          <Button htmlType="submit">등록</Button>
        </div>

        <div className="ProgramWrite_form_content">
          <div className="ProgramWrite_row">
            <div className="ProgramWrite_name">카테고리</div>
            <Select
              style={{ width: 120 }}
              options={categorylist}
              value={programformik.values.category}
              onChange={handleChange}
            />
          </div>
          <div className="ProgramWrite_row">
            <div>이미지</div>
            <Upload {...imageprops}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </div>

          <div className="ProgramWrite_row">
            <div>프로그램 명</div>
            <Input
              type="text"
              name="name"
              placeholder="프로그램명을 입력해 주세요."
              value={programformik.values.name}
              onChange={programformik.handleChange}
            />
          </div>

          <div className="ProgramWrite_row">
            <div>진행기간</div>
            <Input
              type="text"
              name="progress"
              placeholder="진행기간을 입력해 주세요."
              value={programformik.values.progress}
              onChange={programformik.handleChange}
            />
          </div>

          <div className="ProgramWrite_row">
            <div>모집기간</div>
            <Input
              type="text"
              name="recruitment"
              placeholder="모집기간을 입력해 주세요."
              value={programformik.values.recruitment}
              onChange={programformik.handleChange}
            />
          </div>

          <div className="ProgramWrite_row">
            <div>수강료</div>
            <Input
              type="text"
              name="price"
              placeholder="수강료를 입력해 주세요."
              value={Number(programformik.values.price)}
              onChange={programformik.handleChange}
            />
          </div>

          <div className="ProgramWrite_row">
            <div>담당자명</div>
            <Input
              type="text"
              name="manager"
              placeholder="담당자명을 입력해 주세요."
              value={programformik.values.manager}
              onChange={programformik.handleChange}
            />
          </div>

          <div className="ProgramWrite_row">
            <div>모집인원</div>
            <Input
              type="text"
              name="capacity"
              placeholder="모집인원을 입력해 주세요."
              value={Number(programformik.values.capacity)}
              onChange={programformik.handleChange}
            />
          </div>

          <div className="ProgramWrite_row">
            <div>문의전화</div>
            <Input
              type="text"
              name="call"
              placeholder="문의 전화번호를 입력해 주세요."
              value={programformik.values.call}
              onChange={programformik.handleChange}
            />
          </div>
        </div>
      </form>
    </ProgramWriteStyled>
  );
};

export default ProgramWrite;
