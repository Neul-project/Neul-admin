import * as Yup from "yup";

// 로그인 유효성 검사
export const loginSchema = Yup.object({
  email: Yup.string()
    .email("유효한 이메일 형식을 입력해주세요.")
    .required("이메일은 필수입니다."),
  password: Yup.string()
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다.")
    .required("비밀번호는 필수입니다."),
});
