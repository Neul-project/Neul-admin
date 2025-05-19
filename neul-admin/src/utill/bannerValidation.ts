import * as Yup from "yup";

export const bannerValidationSchema = Yup.object({
  leftimg: Yup.mixed()
    .required("좌측 이미지를 업로드 해주세요")
    .test("fileType", "이미지 파일만 업로드 가능합니다", (value) => {
      if (!value) return false;
      if (!(value instanceof File)) return false;
      return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
    }),
  rightimg: Yup.mixed()
    .required("우측 이미지를 업로드 해주세요")
    .test("fileType", "이미지 파일만 업로드 가능합니다", (value) => {
      if (!value) return false;
      if (!(value instanceof File)) return false;
      return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
    }),
  lefturl: Yup.string()
    .url("유효한 URL을 입력하세요")
    .required("좌측 URL은 필수입니다"),
  righturl: Yup.string()
    .url("유효한 URL을 입력하세요")
    .required("우측 URL은 필수입니다"),
});
