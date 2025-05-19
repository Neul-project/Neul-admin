import { ProgramWriteStyled } from "./styled";
import { useFormik } from "formik";
import { programValidationSchema } from "./programValidation";

//antd
import {
  Button,
  ConfigProvider,
  Input,
  Select,
  Upload,
  message,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
const { TextArea } = Input;

//list
import {
  categorylist,
  getCategoryLabel,
  targetlist,
  getParticipationLabel,
} from "@/utill/programcategory";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import clsx from "clsx";
import { useRouter } from "next/router";
import { AntdGlobalTheme, GreenTheme } from "@/utill/antdtheme";

//프로그램 등록 컴포넌트
const ProgramWrite = (props: {
  modify: string;
  list: any;
  getprogramlist: any;

  setIsModalOpen: (open: boolean) => void;
}) => {
  //변수 선언
  const { modify, list, setIsModalOpen, getprogramlist } = props;
  const router = useRouter();
  //useState
  const [programId, setProgramId] = useState();
  const [call, setCall] = useState("");
  const [capacity, setCapacity] = useState<number>(0);
  const [category, setCategory] = useState<string>("");
  const [img, setImg] = useState<any[]>([]);
  const [manager, setManager] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [progress, setProgress] = useState("");
  const [recruitment, setRecruitment] = useState("");
  const [registation, setRegistation] = useState("");
  const [target, setTarget] = useState("");
  const [note, setNote] = useState("");

  //useState
  useEffect(() => {
    //console.log("list", list);

    if (list) {
      setProgramId(list.id ?? "");
      setCall(list.call ?? "");
      setCapacity(list.capacity ?? "");
      setCategory(getCategoryLabel(list.category) ?? "");
      setManager(list.manager ?? "");
      setName(list.name ?? "");
      setPrice(list.price ?? "");
      setProgress(list.progress ?? "");
      setRecruitment(list.recruitment ?? "");
      setRegistation(list.registration_at ?? "");
      setNote(list.note ?? "");
      setTarget(getParticipationLabel(list.target) ?? "");

      //기존 이미지 배열에 있는 내용 가공하기
      const imageUrls = list.img
        ? list.img.split(",").map((img: any) => img.trim())
        : [];

      const fileList = imageUrls.map((url: string, index: number) => ({
        uid: `uploaded-${index}`, // Upload 컴포넌트는 uid 필요
        name: url,
        status: "done",
        url: process.env.NEXT_PUBLIC_API_URL + "/uploads/image/" + url,
      }));

      setImg(fileList);
    }
  }, [list]);

  //antd selects handleChange 함수
  // const handleChange = (value: string) => {
  //   console.log(`selected ${value}`);
  //   programformik.setFieldValue("category", value);
  // };

  const imageprops: UploadProps = {
    beforeUpload: (file) => {
      // 업로드를 막고, formik에만 넣기
      //programformik.setFieldValue("img", [file, file]);
      return false;
    },

    onChange({ fileList }) {
      setImg(fileList); // 파일 리스트 상태 업데이트
      programformik.setFieldValue("img", fileList);
    },

    multiple: true,
    listType: "picture-card",
    maxCount: 3,
  };

  const programformik = useFormik({
    initialValues: {
      name: modify === "modify" ? name : "",
      progress: modify === "modify" ? progress : "",
      category: modify === "modify" ? category : "",
      recruitment: modify === "modify" ? recruitment : "",
      price: modify === "modify" ? price : "",
      manager: modify === "modify" ? manager : "",
      capacity: modify === "modify" ? capacity : "",
      call: modify === "modify" ? call : "",
      img: modify === "modify" ? img : [],
      note: modify === "modify" ? note : "",
      target: modify === "modify" ? target : "",
    },
    enableReinitialize: true,
    validationSchema: programValidationSchema,
    onSubmit: (values) => {
      //console.log("Values", values);
      const formData = new FormData();
      //console.log("폼 제출 값 확인:", values.recruitment);
      formData.append("name", values.name);
      formData.append("progress", values.progress);
      formData.append("recruitment", values.recruitment);
      formData.append("price", String(values.price));
      formData.append("manager", values.manager);
      formData.append("capacity", String(values.capacity));
      formData.append("call", values.call);
      formData.append("category", values.category.toString());
      formData.append("note", values.note);
      formData.append("target", values.target.toString());
      // img 배열 처리
      img.forEach((fileWrapper: any) => {
        if (fileWrapper.originFileObj) {
          // 새로 업로드된 이미지
          formData.append("img", fileWrapper.originFileObj);
        } else if (fileWrapper.url) {
          // 수정 시 기존 이미지
          const fileName = fileWrapper.url.split("/").pop(); //마지막 요소만 가져오기(파일명)
          if (fileName) {
            formData.append("img[]", fileName);
          }
        }
      });

      if (modify === "modify") {
        //프로그램 수정 요청
        //console.log("values", values);
        //console.log("id", programId);

        // for (let [key, value] of formData.entries()) {
        //   console.log(`${key}: ${value}`);
        // }

        // return;

        axiosInstance
          .patch(`program/update/${programId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            notification.success({
              message: `수정 완료`,
              description: `성공적으로 수정이 완료 되었습니다.`,
            });
            getprogramlist();
            setIsModalOpen(false);
          });
      } else {
        //console.log("values", values);

        //프로그램 등록 요청
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
        <div className="ProgramWrite_form_content">
          {/* 이미지 */}
          <div className="ProgramWrite_row">
            <div>대표 이미지</div>
            <ConfigProvider theme={GreenTheme}>
              <Upload
                {...imageprops}
                fileList={img}
                onPreview={(file) => window.open(file.url)}
              >
                <Button icon={<UploadOutlined />} />
              </Upload>
            </ConfigProvider>
          </div>

          {/* 카테고리 */}
          <div className="ProgramWrite_row">
            <div className="ProgramWrite_name">카테고리</div>
            <ConfigProvider theme={AntdGlobalTheme}>
              <Select
                options={categorylist}
                value={
                  modify === "modify" ? category : programformik.values.category
                }
                onChange={(value) => {
                  setCategory(value);
                  programformik.setFieldValue("category", value);
                }}
              />
              {programformik.touched.category &&
                programformik.errors.category && (
                  <div className="ProgramWrite_error_message">
                    {programformik.errors.category}
                  </div>
                )}
            </ConfigProvider>
          </div>

          {/* 참여대상 */}
          <div className="ProgramWrite_row">
            <div className="ProgramWrite_name">참여대상</div>
            <ConfigProvider theme={AntdGlobalTheme}>
              <Input
                type="text"
                name="target"
                placeholder="참여대상을 입력해 주세요"
                value={
                  modify === "modify" ? target : programformik.values.target
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (modify === "modify") {
                    setTarget(value);
                  }
                  programformik.handleChange(e);
                }}
              />
              {programformik.touched.target && programformik.errors.target && (
                <div className="ProgramWrite_error_message">
                  {programformik.errors.target}
                </div>
              )}
            </ConfigProvider>
          </div>

          {/* 프로그램명 */}
          <div className="ProgramWrite_row">
            <div>프로그램명</div>
            <ConfigProvider theme={AntdGlobalTheme}>
              <Input
                type="text"
                name="name"
                placeholder="프로그램명을 입력해 주세요."
                value={modify === "modify" ? name : programformik.values.name}
                onChange={(e) => {
                  const value = e.target.value;
                  if (modify === "modify") {
                    setName(value);
                  }
                  programformik.handleChange(e);
                }}
              />
              {programformik.touched.name && programformik.errors.name && (
                <div className="ProgramWrite_error_message">
                  {programformik.errors.name}
                </div>
              )}
            </ConfigProvider>
          </div>

          {/* 진행기간 */}
          <div className="ProgramWrite_row">
            <div>진행기간</div>
            <ConfigProvider theme={AntdGlobalTheme}>
              <Input
                type="text"
                name="progress"
                placeholder="진행기간을 입력해 주세요."
                value={
                  modify === "modify" ? progress : programformik.values.progress
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (modify === "modify") {
                    setProgress(value);
                  }
                  programformik.handleChange(e);
                }}
              />
              {programformik.touched.progress &&
                programformik.errors.progress && (
                  <div className="ProgramWrite_error_message">
                    {programformik.errors.progress}
                  </div>
                )}
            </ConfigProvider>
          </div>

          {/* 모집기간 */}
          <div className="ProgramWrite_row">
            <div>모집기간</div>
            <ConfigProvider theme={AntdGlobalTheme}>
              <Input
                type="text"
                name="recruitment"
                placeholder="모집기간을 입력해 주세요."
                value={
                  modify === "modify"
                    ? recruitment
                    : programformik.values.recruitment
                }
                onChange={(e) => {
                  const value = e.target.value;

                  if (modify === "modify") {
                    setRecruitment(value);
                  }
                  programformik.handleChange(e);
                }}
              />
              {programformik.touched.recruitment &&
                programformik.errors.recruitment && (
                  <div className="ProgramWrite_error_message">
                    {programformik.errors.recruitment}
                  </div>
                )}
            </ConfigProvider>
          </div>

          {/* 수강료 */}
          <div className="ProgramWrite_row">
            <div>수강료</div>
            <ConfigProvider theme={AntdGlobalTheme}>
              <Input
                type="text"
                name="price"
                placeholder="수강료를 입력해 주세요."
                value={modify === "modify" ? price : programformik.values.price}
                onChange={(e) => {
                  const value = e.target.value;
                  if (modify === "modify") {
                    setPrice(Number(value));
                  }
                  programformik.handleChange(e);
                }}
              />
              {programformik.touched.price && programformik.errors.price && (
                <div className="ProgramWrite_error_message">
                  {programformik.errors.price}
                </div>
              )}
            </ConfigProvider>
          </div>

          {/* 담당자명 */}
          <div className="ProgramWrite_row">
            <div>담당자명</div>
            <ConfigProvider theme={AntdGlobalTheme}>
              <Input
                type="text"
                name="manager"
                placeholder="담당자명을 입력해 주세요."
                value={
                  modify === "modify" ? manager : programformik.values.manager
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (modify === "modify") {
                    setManager(value);
                  }
                  programformik.handleChange(e);
                }}
              />
              {programformik.touched.manager &&
                programformik.errors.manager && (
                  <div className="ProgramWrite_error_message">
                    {programformik.errors.manager}
                  </div>
                )}
            </ConfigProvider>
          </div>

          {/* 모집인원 */}
          <div className="ProgramWrite_row">
            <div>모집인원</div>
            <ConfigProvider theme={AntdGlobalTheme}>
              <Input
                type="text"
                name="capacity"
                placeholder="모집인원을 입력해 주세요."
                value={
                  modify === "modify" ? capacity : programformik.values.capacity
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (modify === "modify") {
                    setCapacity(Number(value));
                  }
                  programformik.handleChange(e);
                }}
              />
              {programformik.touched.capacity &&
                programformik.errors.capacity && (
                  <div className="ProgramWrite_error_message">
                    {programformik.errors.capacity}
                  </div>
                )}
            </ConfigProvider>
          </div>

          {/* 문의전화 */}
          <div className="ProgramWrite_row">
            <div>문의전화</div>
            <ConfigProvider theme={AntdGlobalTheme}>
              <Input
                type="text"
                name="call"
                placeholder="문의 전화번호를 입력해 주세요."
                value={modify === "modify" ? call : programformik.values.call}
                onChange={(e) => {
                  const value = e.target.value;
                  if (modify === "modify") {
                    setCall(value);
                  }
                  programformik.handleChange(e);
                }}
              />
              {programformik.touched.call && programformik.errors.call && (
                <div className="ProgramWrite_error_message">
                  {programformik.errors.call}
                </div>
              )}
            </ConfigProvider>
          </div>

          {/* 프로그램 내용 */}
          <div className="ProgramWrite_row">
            <div>프로그램 내용</div>
            <ConfigProvider theme={AntdGlobalTheme}>
              <TextArea
                name="note"
                placeholder="프로그램 내용을 입력해 주세요."
                value={modify === "modify" ? note : programformik.values.note}
                onChange={(e) => {
                  const value = e.target.value;
                  if (modify === "modify") {
                    setNote(value);
                  }
                  programformik.handleChange(e);
                }}
                rows={8}
              />
              {programformik.touched.note && programformik.errors.note && (
                <div className="ProgramWrite_error_message">
                  {programformik.errors.note}
                </div>
              )}
            </ConfigProvider>
          </div>

          {modify === "modify" ? (
            <div className="ProgramWrite_submit">
              <ConfigProvider theme={GreenTheme}>
                <Button
                  htmlType="submit"
                  type="primary"
                  className="ProgramWrite_submit_btn"
                >
                  수정하기
                </Button>
              </ConfigProvider>
            </div>
          ) : (
            <div className="ProgramWrite_submit">
              <ConfigProvider theme={GreenTheme}>
                <Button
                  htmlType="submit"
                  type="primary"
                  className="ProgramWrite_submit_btn"
                >
                  등록하기
                </Button>
              </ConfigProvider>
            </div>
          )}
        </div>
      </form>
    </ProgramWriteStyled>
  );
};

export default ProgramWrite;
