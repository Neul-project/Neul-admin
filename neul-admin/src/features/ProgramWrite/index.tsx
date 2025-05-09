import { ProgramWriteStyled } from "./styled";
import { useFormik } from "formik";

//antd
import { Button, Select, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

//categroylist
import { categorylist } from "@/utill/programcategory";
import { useState } from "react";
import axiosInstance from "@/lib/axios";

//프로그램 등록 컴포넌트
const ProgramWrite = () => {
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
      category: "2",
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
    <ProgramWriteStyled>
      <div>프로그램 등록 페이지</div>

      <form onSubmit={programformik.handleSubmit}>
        <div>
          <Button htmlType="submit">등록</Button>
        </div>
        <Select
          defaultValue="lucy"
          style={{ width: 120 }}
          options={categorylist}
          value={programformik.values.category}
          onChange={handleChange}
        />
        <div>
          <div>
            <label>이미지</label>
            <Upload {...imageprops}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </div>

          <div>
            <label>프로그램 명</label>
            <input
              type="text"
              name="name"
              placeholder="프로그램명을 입력해 주세요."
              value={programformik.values.name}
              onChange={programformik.handleChange}
            />
          </div>

          <div>
            <label>진행기간</label>
            <input
              type="text"
              name="progress"
              placeholder="진행기간을 입력해 주세요."
              value={programformik.values.progress}
              onChange={programformik.handleChange}
            />
          </div>

          <div>
            <label>모집기간</label>
            <input
              type="text"
              name="recruitment"
              placeholder="모집기간을 입력해 주세요."
              value={programformik.values.recruitment}
              onChange={programformik.handleChange}
            />
          </div>

          <div>
            <label>수강료</label>
            <input
              type="text"
              name="price"
              placeholder="수강료를 입력해 주세요."
              value={Number(programformik.values.price)}
              onChange={programformik.handleChange}
            />
          </div>

          <div>
            <label>담당자명</label>
            <input
              type="text"
              name="manager"
              placeholder="담당자명을 입력해 주세요."
              value={programformik.values.manager}
              onChange={programformik.handleChange}
            />
          </div>

          <div>
            <label>모집인원</label>
            <input
              type="text"
              name="capacity"
              placeholder="모집인원을 입력해 주세요."
              value={Number(programformik.values.capacity)}
              onChange={programformik.handleChange}
            />
          </div>

          <div>
            <label>문의전화</label>
            <input
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
