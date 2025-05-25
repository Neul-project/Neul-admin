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
