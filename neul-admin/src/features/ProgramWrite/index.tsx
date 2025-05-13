import { ProgramWriteStyled } from "./styled";
import { useFormik } from "formik";

//antd
import { Button, Input, Select, Upload, message, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

//categroylist
import { categorylist } from "@/utill/programcategory";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import clsx from "clsx";
import { useRouter } from "next/router";

//프로그램 등록 컴포넌트
const ProgramWrite = (props: { modify: string; list: any }) => {
  //변수 선언
  const { modify, list } = props;
  const router = useRouter();
  //useState
  const [programId, setProgramId] = useState();
  const [call, setCall] = useState();
  const [capacity, setCapacity] = useState();
  const [category, setCategory] = useState();
  const [img, setImg] = useState();
  const [manager, setManager] = useState();
  const [name, setName] = useState();
  const [price, setPrice] = useState();
  const [progress, setProgress] = useState();
  const [recruitment, setRecruitment] = useState();
  const [registation, setRegistation] = useState();

  //useState
  useEffect(() => {
    console.log("list", list);

    if (list) {
      setProgramId(list.id ?? "");
      setCall(list.call ?? "");
      setCapacity(list.capacity ?? "");
      setCategory(list.category ?? "");
      setManager(list.manager ?? "");
      setName(list.name ?? "");
      setPrice(list.price ?? "");
      setProgress(list.progress ?? "");
      setRecruitment(list.recruitment ?? "");
      setRegistation(list.registration_at ?? "");

      //기존 이미지 배열에 있는 내용 가공하기
      const imageUrls = list.img
        ? list.img.split(",").map((img: any) => img.trim())
        : [];

      const fileList = imageUrls.map((url: string, index: number) => ({
        uid: `uploaded-${index}`, // Upload 컴포넌트는 uid 필요
        name: url,
        status: "done",
        url: process.env.NEXT_PUBLIC_API_URL + "/uploads/" + url,
      }));

      setImg(fileList);
    }
  }, [list]);

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
      name: modify === "modify" ? name ?? "" : "",
      progress: modify === "modify" ? progress ?? "" : "",
      category: modify === "modify" ? category ?? "" : "",
      recruitment: modify === "modify" ? recruitment ?? "" : "",
      price: modify === "modify" ? price ?? "" : "",
      manager: modify === "modify" ? manager ?? "" : "",
      capacity: modify === "modify" ? capacity ?? "" : "",
      call: modify === "modify" ? call ?? "" : "",
      img: [],
    },
    onSubmit: (values) => {
      //console.log("Values", values);
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
      if (modify === "modify") {
      } else {
        axiosInstance
          .post(`/program/registration`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((res) => {
            //console.log("등록 성공", res);
            notification.success({
              message: `등록 완료`,
              description: `성공적으로 등록이 완료 되었습니다.`,
            });

            router.push("/program/manage");
          });
      }
    },
  });

  return (
    <ProgramWriteStyled className={clsx("ProgramWrite_main_wrap")}>
      {modify ? (
        <></>
      ) : (
        <div className="ProgramWrite_h3">
          <h3>프로그램 등록 페이지</h3>
        </div>
      )}

      <form onSubmit={programformik.handleSubmit}>
        {modify === "modify" ? (
          <div className="ProgramWrite_submit">
            <Button htmlType="submit">수정하기</Button>
          </div>
        ) : (
          <div className="ProgramWrite_submit">
            <Button htmlType="submit">등록하기</Button>
          </div>
        )}

        <div className="ProgramWrite_form_content">
          <div className="ProgramWrite_row">
            <div className="ProgramWrite_name">카테고리</div>
            <Select
              style={{ width: 120 }}
              options={categorylist}
              value={programformik.values.category}
              onChange={(value) =>
                programformik.setFieldValue("category", value)
              }
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
