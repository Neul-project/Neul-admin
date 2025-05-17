import * as Yup from "yup";

export const programValidationSchema = Yup.object().shape({
  category: Yup.string().required("카테고리를 선택해 주세요."),
  target: Yup.string().required("참여대상을 입력해 주세요."),
  name: Yup.string().required("프로그램명을 입력해 주세요."),
  progress: Yup.string()
    .required("진행기간을 입력해 주세요.")
    .matches(
      /^(\d{4}\.\d{2}\.\d{2})(~\d{4}\.\d{2}\.\d{2})?$/,
      "yyyy.mm.dd 또는 yyyy.mm.dd~yyyy.mm.dd 형식으로 입력해 주세요."
    ),
  recruitment: Yup.string()
    .required("모집기간을 입력해 주세요.")
    .matches(
      /^(\d{4}\.\d{2}\.\d{2})(~\d{4}\.\d{2}\.\d{2})?$/,
      "yyyy.mm.dd 또는 yyyy.mm.dd~yyyy.mm.dd 형식으로 입력해 주세요."
    ),
  price: Yup.number()
    .typeError("숫자로 입력해 주세요.")
    .required("수강료를 입력해 주세요."),
  manager: Yup.string().required("담당자명을 입력해 주세요."),
  capacity: Yup.number()
    .typeError("숫자로 입력해 주세요.")
    .required("모집인원을 입력해 주세요."),
  call: Yup.string().required("문의 전화번호를 입력해 주세요."),
  note: Yup.string().required("프로그램 내용을 입력해 주세요."),
});
