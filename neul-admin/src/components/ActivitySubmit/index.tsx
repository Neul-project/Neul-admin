import { ActivityStyled, ActivityTheme } from "./styled";
import { StatusTheme } from "@/features/StatusList/styled";
import { useFormik } from "formik";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { activityOptions } from "@/utill/activityoptionlist";
//antd
import {
  Input,
  Upload,
  Button,
  Select,
  Radio,
  ConfigProvider,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
const { TextArea } = Input;

//Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { useAuthStore } from "@/stores/useAuthStore";
import { AntdGlobalTheme } from "@/utill/antdtheme";
import { activityValidationSchema } from "./activityValidation";

interface DataProps {
  com_type: string;
  rowcontent?: any;
  setIsModalOpen?: any;
  getUserlist?: any;
  getTargetlist?: any;
  selectlist?: any;
  patientId?: number;
}

//활동 기록 등록 컴포넌트 - formik 작성
const ActivitySubmit = ({
  com_type,
  rowcontent,
  setIsModalOpen,
  getUserlist,
  getTargetlist,
  selectlist,
  patientId,
}: DataProps) => {
  //변수 선언

  const router = useRouter();
  const { user } = useAuthStore();
  //console.log("Res", rowcontent);

  //useState
  const [imgarr, setImgarr] = useState<any[]>([]); //원본 이미지 배열
  const [ward, setWard] = useState<any>(); //수정 - 피보호자 선택
  const [type, setType] = useState<string>(""); //수정 - 활동 종류 선택
  const [rehabilitation, setRehabilitation] = useState(); //수정 - 재활 치료 선택
  const [title, setTitle] = useState(""); //수정 - 제목
  const [note, setNote] = useState(""); //수정 - 특이사항
  const [select_ward, setSelectWard] = useState<any[]>();
  const [adminId, setAdminId] = useState<number | null>(); //관리자id(===로그인한 userid)
  const [activityId, setActivityId] = useState();

  //userid useState넣기
  useEffect(() => {
    if (user?.id) {
      setAdminId(user.id);
    }
  }, [user]);

  useEffect(() => {
    const adminId = user?.id; //도우미 id

    //도우미에 따른 피보호자 내용 전체 가져오기
    axiosInstance
      .get("/activity/targetlist", { params: { adminId } })
      .then((res) => {
        //console.log("activity targetlist res", res.data);
        const data = res.data;
        const mappedData: any[] = data.map((item: any, index: number) => ({
          value: item.id,
          label: item.name + "(" + item.id + ")",
        }));
        setSelectWard(mappedData);
      });
  }, []);

  useEffect(() => {
    //수정하기로 들어 온 경우 상태 업데이트
    if (rowcontent) {
      console.log("res", rowcontent);
      setWard(rowcontent.patient.name ?? "");
      setType(rowcontent.type ?? "");
      setRehabilitation(rowcontent.rehabilitation ?? "");
      setTitle(rowcontent.title ?? "");
      setNote(rowcontent.note ?? "");
      setActivityId(rowcontent.id ?? "");

      //기존 이미지 배열에 있는 내용 가공하기
      const imageUrls = rowcontent.img
        ? rowcontent.img.split(",").map((img: any) => img.trim())
        : [];

      const fileList = imageUrls.map((url: string, index: number) => ({
        uid: `uploaded-${index}`, // Upload 컴포넌트는 uid 필요
        name: url,
        status: "done",
        url: process.env.NEXT_PUBLIC_API_URL + "/uploads/image/" + url,
      }));

      //console.log("file", fileList);

      setImgarr(fileList); // Upload에서 사용할 리스트
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
      activityformik.setFieldValue("imgarr", fileList);
    },
    multiple: true,
    listType: "picture-card",
    maxCount: 5,
  };

  //해당 행 삭제 클릭 함수
  const deleteRow = () => {
    //console.log("activityId", [activityId]);
    const deleteIds = [activityId];
    // const ids = rowcontent.map((item: any) => item.id); //배열로 보내기
    axiosInstance.delete("/activity/delete", {
      data: { ids: deleteIds },
    });
  };

  //formik
  const activityformik = useFormik({
    initialValues: {
      title: com_type === "modify" ? title : "",
      type: com_type === "modify" ? type : "",
      note: com_type === "modify" ? note : "",
      patient_id: com_type === "modify" ? ward : "",
      rehabilitation: com_type === "modify" ? rehabilitation : "",
      imgarr: com_type === "modify" ? imgarr : [],
    },
    enableReinitialize: true, // 외부 값으로 초기값으로 세팅하기 위해 사용

    onSubmit: (values) => {
      const userid = user?.id; //도우미 id

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("type", values.type);
      formData.append("note", values.note);
      formData.append("patient_id", values.patient_id ?? "");
      formData.append("rehabilitation", values.rehabilitation ?? "");

      //console.log("imgarr", imgarr);
      imgarr.forEach((fileWrapper: any) => {
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

      if (rowcontent) {
        // console.log("values", values);

        // for (let [key, value] of formData.entries()) {
        //   console.log(`${key}: ${value}`);
        // }
        // return;

        //수정하기
        axiosInstance
          .patch(`/activity/update/${activityId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            notification.success({
              message: `수정 완료`,
              description: `성공적으로 수정이 완료 되었습니다.`,
            });
            //getUserlist();

            if (patientId) {
              //select로 선택해서 들어온 경우 처리
              selectlist(patientId);
            } else {
              getUserlist();
            }
            setIsModalOpen(false);
          });
      } else {
        //기록하기

        // console.log("values", values);

        // for (let [key, value] of formData.entries()) {
        //   console.log(`${key}: ${value}`);
        // }

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

        router.push("/activity/write");
      }
    },
    validationSchema: activityValidationSchema,
    validateOnChange: true,
    validateOnBlur: true,
  });

  return (
    <ActivityStyled>
      <form
        className="activitySubmit_form"
        onSubmit={activityformik.handleSubmit}
      >
        {/* 피보호자 선택 */}
        <div className="activitySubmit_ward">
          <div className="activitySubmit_text">피보호자(ID)</div>
          <ConfigProvider theme={ActivityTheme}>
            <Select
              className="activitySubmit_select"
              placeholder="피보호자를 선택해 주세요."
              onChange={(value) =>
                activityformik.setFieldValue("patient_id", value)
              }
              options={select_ward}
              disabled={com_type === "modify"}
              value={com_type === "modify" ? ward : undefined}
            />
          </ConfigProvider>
        </div>
        {typeof activityformik.errors.patient_id === "string" && (
          <div className="activitySubmit_error_message  activitySubmit_error_title">
            {activityformik.errors.patient_id}
          </div>
        )}
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
                  setTitle(value);
                }
                activityformik.handleChange(e);
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
          <div className="activitySubmit_image">
            <ConfigProvider theme={StatusTheme}>
              <Upload
                {...fileprops}
                fileList={imgarr}
                onPreview={(file) => window.open(file.url)}
              >
                <Button icon={<UploadOutlined />} />
              </Upload>
            </ConfigProvider>

            <div className="activitySubmit_swiper_div">
              {imgarr && imgarr.length > 0 ? (
                <Swiper
                  modules={[Pagination]}
                  className="activitySubmit_swiper"
                  spaceBetween={50}
                  slidesPerView={1}
                  pagination={{ clickable: true }}
                >
                  {imgarr.map((element: any, index: number) => {
                    let src = "";

                    if (com_type === "modify" && element.url) {
                      //  기존 이미지
                      src = `${
                        process.env.NEXT_PUBLIC_API_URL
                      }/uploads/image/${element.url.split("/").pop()}`;
                    } else if (element.originFileObj) {
                      // 새로 업로드된 이미지
                      src = URL.createObjectURL(element.originFileObj);
                    } else if (element.thumbUrl) {
                      // 드래그 등에서 썸네일 제공된 경우
                      src = element.thumbUrl;
                    }

                    return (
                      <SwiperSlide key={index}>
                        <img
                          src={src}
                          alt={`preview-${index}`}
                          className="swperimg"
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              ) : (
                <div className="activitySubmit_swiper_text">미리보기</div>
              )}
            </div>
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
            <div className="activitySubmit_content">
              <div className="activitySubmit_text">활동 종류</div>
              <ConfigProvider theme={StatusTheme}>
                <Select
                  className="activitySubmit_select"
                  value={
                    com_type === "modify"
                      ? type
                      : activityformik.values.type || undefined
                  }
                  onChange={(value) => {
                    setType(value);
                    activityformik.setFieldValue("type", value);
                  }}
                  placeholder="활동종류를 선택해 주세요."
                  options={activityOptions}
                />
              </ConfigProvider>
            </div>
            {activityformik.touched.type && activityformik.errors.type && (
              <div className="activitySubmit_error_message">
                {activityformik.errors.type}
              </div>
            )}
          </div>

          {/* 재활 치료 */}
          <div>
            <div className="activitySubmit_content">
              <div className="activitySubmit_text">재활 치료</div>
              <ConfigProvider theme={StatusTheme}>
                <Radio.Group
                  buttonStyle="solid"
                  value={activityformik.values.rehabilitation}
                  onChange={(e) =>
                    activityformik.setFieldValue(
                      "rehabilitation",
                      e.target.value
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
            {activityformik.touched.rehabilitation &&
              activityformik.errors.rehabilitation && (
                <div className="activitySubmit_error_message ">
                  {activityformik.errors.rehabilitation}
                </div>
              )}
          </div>
        </div>

        {/* 특이 사항 */}
        <div>
          <div className="activitySubmit_text">특이 사항</div>
          <div className="activitySubmit_toastEdit">
            <ConfigProvider theme={ActivityTheme}>
              <TextArea
                rows={7}
                name="note"
                value={
                  com_type === "modify" ? note : activityformik.values.note
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (com_type === "modify") {
                    setNote(value);
                  }
                  activityformik.handleChange(e);
                }}
              />
            </ConfigProvider>
          </div>
        </div>
        {activityformik.touched.note && activityformik.errors.note && (
          <div className="activitySubmit_error_message">
            {activityformik.errors.note}
          </div>
        )}
        <div className="activitySubmit_record_div">
          <ConfigProvider theme={StatusTheme}>
            <Button
              type="primary"
              htmlType="submit"
              className="activitySubmit_record"
              disabled={!activityformik.isValid && activityformik.dirty}
            >
              {com_type === "write" ? "기록하기" : "수정하기"}
            </Button>
          </ConfigProvider>
          {com_type === "modify" ? (
            <ConfigProvider theme={AntdGlobalTheme}>
              <Button className="activitySubmit_record" onClick={deleteRow}>
                삭제하기
              </Button>
            </ConfigProvider>
          ) : (
            ""
          )}
        </div>
      </form>
    </ActivityStyled>
  );
};

export default ActivitySubmit;
