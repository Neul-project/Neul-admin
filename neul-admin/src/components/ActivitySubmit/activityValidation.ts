import * as Yup from "yup";

export const activityValidationSchema = Yup.object().shape({
  patient_id: Yup.string().required("피보호자를 선택해주세요"),
  title: Yup.string().required("제목을 입력해주세요"),
  type: Yup.string().required("활동 종류를 선택해주세요"),
  rehabilitation: Yup.string().required("재활 치료 여부를 선택해주세요"),
  //note: Yup.string().required("특이 사항을 입력해주세요"),
});
