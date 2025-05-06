import { ActivityStyled, ActivityTheme } from "./styled";
import { useFormik } from "formik";
import * as Yup from "yup";

//antd
import {
  Input,
  Upload,
  message,
  Button,
  Select,
  Radio,
  ConfigProvider,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps, RadioChangeEvent } from "antd";
const { TextArea } = Input;

//Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

import { useEffect, useState } from "react";
import { Pagination, A11y } from "swiper/modules";
import axiosInstance from "@/lib/axios";

//활동 기록 등록 컴포넌트 - formik 작성
const ActivitySubmit = (props: { com_type: string; rowcontent: any }) => {
  const { com_type, rowcontent } = props;
  //useState
  const [imgarr, setImgarr] = useState<any[]>([]);
  const [ward, setWard] = useState<any>(); //수정 - 피보호자 선택
  const [type, setType] = useState<string>(""); //수정 - 활동 종류 선택
  const [rehabilitation, setRehabilitation] = useState(); //수정 - 재활 치료 선택
  const [title, setTitle] = useState(""); //수정 - 제목
  const [com_imgarr, setCom_imgarr] = useState<any[]>(); //수정 - 이미지
  const [note, setNote] = useState(""); //수정 - 특이사항
  const [select_ward, setSelectWard] = useState<any[]>();

  console.log("rowcontent", rowcontent);
  useEffect(() => {
    if (rowcontent) {
      setWard(rowcontent.patient.id ?? "");
      setType(rowcontent.type ?? "");
      setRehabilitation(rowcontent.rehabilitation ?? "");
      setTitle(rowcontent.title ?? "");
      setNote(rowcontent.note ?? "");
    }
  }, [rowcontent]);
  //파일 업로드
  const fileprops: UploadProps = {
    beforeUpload: () => {
      // 자동 업로드 방지
      return false;
    },

    onChange({ fileList }) {
      setImgarr(fileList); // 파일 리스트 상태 업데이트
      //console.log("url", fileList);
    },
    multiple: true,
    listType: "picture-card",
    maxCount: 5,
  };

  //활동 종류 select
  const select_option = [
    { value: "walk", label: "산책" },
    { value: "play", label: "놀이" },
    { value: "exercise", label: "운동" },
  ];

  useEffect(() => {
    const adminId = 1; //도우미 id

    //도우미에 따른 피보호자 내용 전체 가져오기
    axiosInstance
      .get("/activity/targetlist", { params: { adminId } })
      .then((res) => {
        //console.log("activity targetlist res", res.data);
        const data = res.data;
        const mappedData: any[] = data.map((item: any, index: number) => ({
          value: item.id,
          label: item.name,
        }));
        setSelectWard(mappedData);
      });
  }, []);

  //해당 행 삭젝 클릭 함수
  const deleteRow = () => {
    const ids = rowcontent.map((item: any) => item.id); //배열로 보내기

    axiosInstance.delete("/activity/delete", {
      data: { ids },
    });
  };

  //formik
  const activityformik = useFormik({
    initialValues: {
      title: com_type === "modify" ? title : "",
      type: com_type === "modify" ? type : "walk",
      note: com_type === "modify" ? note : "",
      patient_id: com_type === "modify" ? ward : "",
      rehabilitation: com_type === "modify" ? rehabilitation : "",
    },
    enableReinitialize: true, // 외부 값으로 초기값으로 세팅하기 위해 사용
    onSubmit: (values) => {
      const userid = 1; //임시 아이디 (도우미)

      const formData = new FormData();

      formData.append("title", values.title);
      formData.append("type", values.type);
      formData.append("note", values.note);
      formData.append("patient_id", values.patient_id ?? "");
      formData.append("rehabilitation", values.rehabilitation ?? "");

      imgarr.forEach((fileWrapper: any) => {
        if (fileWrapper.originFileObj) {
          formData.append("img", fileWrapper.originFileObj);
        }
      });

      if (rowcontent) {
        //수정하기
        //console.log(activityformik.values);

        axiosInstance
          .put(`/activity/update/${userid}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            notification.success({
              message: `수정 완료`,
              description: `성공적으로 수정이 완료 되었습니다.`,
            });
          });
      } else {
        //기록하기

        //백엔드 저장 요청
        axiosInstance
          .post(`/activity/write/${userid}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            notification.success({
              message: `등록 완료`,
              description: `성공적으로 등록이 완료 되었습니다.`,
            });
          });
      }
    },
    validationSchema: Yup.object({
      title: Yup.string().required("제목을 입력해 주세요."),
    }),
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
              disabled={com_type === "modify"}
              value={com_type === "modify" ? ward : undefined}
            />
          </ConfigProvider>
        </div>
        {/* 제목 */}
        <div className="activitySubmit_title">
          <div className="activitySubmit_text">제목</div>
          <ConfigProvider theme={ActivityTheme}>
            <Input
              name="title"
              value={
                com_type === "modify" ? title : activityformik.values.title
              }
              onChange={(e) => {
                const value = e.target.value;
                if (com_type === "modify") {
                  setTitle(value); // 추가!
                }
                activityformik.handleChange(e); // 여전히 formik도 반영
              }}
              className="activitySubmit_title_input"
              placeholder="제목을 입력하시오"
            />
          </ConfigProvider>
        </div>
        {activityformik.errors.title && (
          <div className="activitySubmit_error_message">
            {activityformik.errors.title}
          </div>
        )}
        {/* swiper */}
        <div className="activitySubmit_image">
          <Upload {...fileprops} fileList={imgarr}>
            <Button icon={<UploadOutlined />}></Button>
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
                >
                  {imgarr.map((element: any, index: number) => {
                    if (element.originFileObj) {
                      //console.log(URL.createObjectURL(element.originFileObj));
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
        <div
          className={`activitySubmit_type ${
            com_type === "modify" ? "activitySubmit_type_column" : ""
          }`}
        >
          {/* 활동종류 */}
          <div>
            <div className="activitySubmit_text">활동 종류</div>
            <ConfigProvider theme={ActivityTheme}>
              <Select
                className="activitySubmit_select"
                value={
                  com_type === "modify" ? type : activityformik.values.type
                }
                defaultValue="walk"
                onChange={(value) => {
                  setType(value);
                  activityformik.setFieldValue("type", value);
                }}
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
                <Radio.Button className="activitySubmit_radio" value="none">
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
              value={com_type === "modify" ? note : activityformik.values.note}
              onChange={activityformik.handleChange}
            />
          </ConfigProvider>
        </div>

        <div className="activitySubmit_record_div">
          <ConfigProvider theme={ActivityTheme}>
            <Button
              htmlType="submit"
              className="activitySubmit_record"
              disabled={!activityformik.isValid && activityformik.dirty}
            >
              {com_type === "write" ? "기록하기" : "수정하기"}
            </Button>
          </ConfigProvider>
          {com_type === "modify" ? (
            <Button className="activitySubmit_record" onClick={deleteRow}>
              삭제하기
            </Button>
          ) : (
            ""
          )}
        </div>
      </form>
    </ActivityStyled>
  );
};

export default ActivitySubmit;
