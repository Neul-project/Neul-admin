import * as Yup from "yup";

// 비밀번호 변경 유효성 검사
export const changePwValidation = Yup.object().shape({
  password: Yup.string()
    .min(6, "비밀번호는 최소 6자리 이상이어야 합니다.")
    .required("비밀번호를 입력해주세요."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호 확인을 입력해주세요."),
});

// 환불 모달 유효성 검사
export const refundValidation = Yup.object({
  accountNumber: Yup.string().required("환불 계좌번호를 입력해주세요."),
  accountHolder: Yup.string().required("예금자명을 입력해주세요."),
  bankName: Yup.string().required("은행을 선택해주세요."),
  refundReason: Yup.string().required("환불 사유를 입력해주세요."),
});

// 아이디 찾기 유효성 검사
export const findIdValidationSchema = Yup.object({
  name: Yup.string().required("이름을 입력해주세요."),
  phone: Yup.string()
    .matches(/^01[016789][0-9]{7,8}$/, "올바른 전화번호 형식이 아닙니다.")
    .required("전화번호를 입력해주세요."),
});
