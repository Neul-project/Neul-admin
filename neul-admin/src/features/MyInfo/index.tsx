import clsx from "clsx";
import { MyInfoStyled } from "./styled";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { changePwValidation } from "@/utill/userValidation";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/router";
import ModalCompo from "@/components/ModalCompo";
import * as S from "@/components/ModalCompo/ModalContent";
import { Button, ConfigProvider, notification } from "antd";
import { GreenTheme } from "@/utill/antdtheme";
import { HelperInfo } from "./info";

// 로그인한 도우미 정보
const MyInfo = () => {
  const [info, setInfo] = useState<HelperInfo>();
  const [pwOpen, setPwOpen] = useState(false);
  const [form, setForm] = useState<{
    desiredPay: number;
    experience: string;
    certificateName: string;
    certificateName2: string | null;
    certificateName3: string | null;
    certificateFile: File | null;
    profileImageFile: File | null;
  }>({
    desiredPay: 0,
    experience: "",
    certificateName: "",
    certificateName2: null,
    certificateName3: null,
    certificateFile: null,
    profileImageFile: null,
  });

  const adminId = useAuthStore((state) => state.user?.id);
  const router = useRouter();

  useEffect(() => {
    if (info) {
      setForm({
        desiredPay: info.desiredPay,
        experience: info.experience,
        certificateName: info.certificateName,
        certificateName2: info.certificateName2 ?? "",
        certificateName3: info.certificateName3 ?? "",
        certificateFile: null,
        profileImageFile: null,
      });
    }
  }, [info]);

  //로그인한 도우미 정보 가져오기
  const getMyInfo = async () => {
    if (!adminId) return;
    //console.log(adminId);
    try {
      const res = await axiosInstance.get("/helper/userlist", {
        params: { id: adminId },
      });

      //console.log("res", res.data);
      setInfo(res.data);
    } catch (e) {
      console.error("해당 도우미 정보 불러오기 실패: ", e);
    }
  };

  useEffect(() => {
    getMyInfo();
  }, [adminId]);

  // 비밀번호 변경 요청
  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: changePwValidation,
    onSubmit: async (values) => {
      //비밀번호 관련
      try {
        //비밀번호 변경
        const res = await axiosInstance.patch("/auth/password", {
          newPassword: values.password,
        });

        if (res.data?.ok) {
          notification.success({
            message: "변경 성공",
            description: "비밀번호가 성공적으로 변경되었습니다.",
          });
          setPwOpen(false);
        } else {
          notification.error({
            message: "변경 실패",
            description: "비밀번호 변경에 실패했습니다.",
          });
        }
      } catch (error) {
        //console.error("비밀번호 변경 오류:", error);
        notification.error({
          message: "변경 실패",
          description: "서버 오류가 발생했습니다.",
        });
      }
    },
  });

  // 회원탈퇴 요청
  const handleWithdraw = async () => {
    const confirmed = confirm("정말 회원을 탈퇴하시겠습니까?");
    if (!confirmed) return;

    try {
      const res = await axiosInstance.delete("/user/withdraw");

      //console.log("회원탈퇴", res.data);

      if (res.data) {
        // access_token, refresh_token 제거 및 zustand 상태 초기화
        useAuthStore.getState().logout();

        alert("탈퇴가 완료되었습니다.");
        router.push("/");
      } else {
        alert("탈퇴에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (err: any) {
      console.error("회원탈퇴 오류:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, certificateFile: file }));
  };

  const handleUpdate = async () => {
    const formData = new FormData();

    const values = {
      desiredPay: form.desiredPay,
      experience: form.experience,
      certificateName_01: form.certificateName,
      certificateName_02: form.certificateName2,
      certificateName_03: form.certificateName3,
      certificate: form.certificateFile,
      profileImage: form.profileImageFile,
    };

    Object.entries(values).forEach(([key, val]: [string, unknown]) => {
      if (typeof val === "object" && val instanceof File) {
        formData.append(key, val);
      } else if (val !== undefined && val !== null && val !== "") {
        formData.append(key, String(val));
      }
    });

    // 사용자 id같이 전송
    if (adminId) {
      formData.append("userId", String(adminId));
    }

    // 파일을 새로 업로드하지 않은 경우 기존 파일명 유지
    if (!values.profileImage && info?.profileImage) {
      formData.append("existingProfileImage", info.profileImage);
    }
    if (!values.certificate && info?.certificate) {
      formData.append("existingCertificate", info.certificate);
    }

    // for (const [key, value] of formData.entries()) {
    //   console.log(`${key}:`, value);
    // }

    try {
      await axiosInstance.patch("/helper/edit-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      //alert("수정되었습니다!");
      notification.success({
        message: `개인정보 수정`,
        description: `성공적으로 개인정보가 수정 되었습니다.`,
      });
      getMyInfo(); // 최신 데이터 다시 가져오기
    } catch (e) {
      //console.error("수정 실패", e);
      alert("수정 실패");
    }
  };

  if (!info) return <div>불러오는 중💫</div>;

  const {
    user,
    birth,
    gender,
    desiredPay,
    experience,
    certificate,
    certificateName,
    certificateName2,
    certificateName3,
    profileImage,
  } = info;

  return (
    <MyInfoStyled className={clsx("myinfo_wrap")}>
      <div className="myinfo_profile_wrap">
        {/* 프로필 사진 */}
        <div>
          {/* {profileImage && ( */}
          <div className="myinfo_img_box">
            <img
              className="myinfo_img"
              src={
                form.profileImageFile
                  ? URL.createObjectURL(form.profileImageFile)
                  : `${process.env.NEXT_PUBLIC_API_URL}/uploads/image/${profileImage}`
              }
              alt="프로필"
            />
          </div>
          {/* )} */}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setForm((prev) => ({ ...prev, profileImageFile: file }));
              }
            }}
          />
        </div>

        <div className="myinfo_top_box">
          {/* 이름, 이메일, 비밀번호 변경 */}
          <div className="myinfo_flexs myinfo_name_box">
            <div className="myinfo_cont">
              <div className="myinfo_name">
                <span>{info.user?.name}</span>님
              </div>
              <div className="myinfo_email">{info.user?.email}</div>
            </div>

            {/* 로컬로그인일 경우만 보임 */}
            {user?.provider === "local" && (
              <div className="myinfo_pw_box">
                <div className="myinfo_pw_btn" onClick={() => setPwOpen(true)}>
                  비밀번호 변경
                </div>
              </div>
            )}
          </div>

          {/* 전화번호 */}
          <div className="myinfo_flexs">
            <span className="myinfo_title">전화번호</span>
            <span className="myinfo_content">{user.phone}</span>
          </div>

          {/* 생년월일 */}
          <div className="myinfo_flexs">
            <span className="myinfo_title">생년월일</span>
            <span className="myinfo_content">{birth}</span>
          </div>

          {/* 성별 */}
          <div className="myinfo_flexs">
            <span className="myinfo_title">성별</span>
            <span className="myinfo_content">
              {gender === "male" ? "남성" : "여성"}
            </span>
          </div>
        </div>

        {/* 비밀번호 변경 모달 */}
        {pwOpen && (
          <ModalCompo onClose={() => setPwOpen(false)}>
            <S.ModalFormWrap onSubmit={formik.handleSubmit}>
              <S.ModalTitle>비밀번호 변경</S.ModalTitle>

              <S.ModalInputDiv>
                <S.ModalInput
                  type="password"
                  name="password"
                  placeholder="새로운 비밀번호를 입력해주세요"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="error">{formik.errors.password}</div>
                )}
              </S.ModalInputDiv>
              <S.ModalInputDiv>
                <S.ModalInput
                  type="password"
                  name="confirmPassword"
                  placeholder="비밀번호를 확인해주세요"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <div className="error">{formik.errors.confirmPassword}</div>
                  )}
              </S.ModalInputDiv>

              <div>
                <S.ModalButton type="submit">변경하기</S.ModalButton>
              </div>
            </S.ModalFormWrap>
          </ModalCompo>
        )}
      </div>

      <div className="myinfo_bottom_box">
        {/* 희망 일급 */}
        <div className="myinfo_flex">
          <span className="myinfo_title">희망 일당</span>
          <input
            type="number"
            name="desiredPay"
            value={form.desiredPay}
            onChange={handleChange}
            className="myinfo_input"
          />
        </div>

        {/* 경력 */}
        <div className="myinfo_flex">
          <span className="myinfo_title">경력</span>
          <input
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="myinfo_input"
          />
        </div>

        {/* 자격증명 */}
        <div className="myinfo_flex">
          <span className="myinfo_title">자격증 명</span>
          <input
            type="text"
            name="certificateName"
            value={form.certificateName}
            onChange={handleChange}
            className="myinfo_input"
          />
        </div>
        {/* 자격증명2 */}
        <div className="myinfo_flex">
          <span className="myinfo_title">자격증 명2</span>
          <input
            type="text"
            name="certificateName2"
            value={form.certificateName2 ?? ""}
            onChange={handleChange}
            className="myinfo_input"
          />
        </div>
        {/* 자격증명3 */}
        <div className="myinfo_flex">
          <span className="myinfo_title">자격증 명3</span>
          <input
            type="text"
            name="certificateName3"
            value={form.certificateName3 ?? ""}
            onChange={handleChange}
            className="myinfo_input"
          />
        </div>

        {/* 자격증 PDF */}
        <div className="myinfo_flex_pdf">
          {certificate && <span className="myinfo_title">자격증 PDF</span>}
          <div className="myinfo_pdf">
            {certificate && (
              <>
                <a
                  className="myinfo_origin_pdf"
                  href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/file/${certificate}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  기존 파일 보기
                </a>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
              </>
            )}
          </div>
        </div>
        <ConfigProvider theme={GreenTheme}>
          <div className="myinfo_button_box">
            <Button onClick={handleUpdate}>수정하기</Button>
          </div>
        </ConfigProvider>
      </div>
    </MyInfoStyled>
  );
};

export default MyInfo;
