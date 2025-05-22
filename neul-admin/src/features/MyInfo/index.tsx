import clsx from "clsx";
import { MyInfoStyled } from "./styled";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

interface HelperInfo {
  id: number;
  gender: string;
  birth: string;
  profileImage: string;
  certificate: string; // 자격증 pdf파일
  desiredPay: number; // 희망 일당
  experience: string; // 경력사항
  certificateName: string;
  certificateName2: string | null;
  certificateName3: string | null;
  status: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string | null;
    created_at: string;
    password: string;
    provider: "local" | string;
    role: "admin" | "user" | string;
  };
}

// 로그인한 도우미 정보
const MyInfo = () => {
  const [info, setInfo] = useState<HelperInfo>();
  const [form, setForm] = useState({
    desiredPay: 0,
    experience: "",
    certificateName: "",
    certificateFile: null as File | null,
    profileImageFile: null as File | null,
  });

  useEffect(() => {
    if (info) {
      setForm({
        desiredPay: info.desiredPay,
        experience: info.experience,
        certificateName: info.certificateName,
        certificateFile: null,
        profileImageFile: null,
      });
    }
  }, [info]);

  const getMyInfo = async () => {
    try {
      const res = await axiosInstance.get("/helper/userlist");
      console.log(res.data);
      setInfo(res.data);
    } catch (e) {
      console.error("해당 도우미 정보 불러오기 실패: ", e);
    }
  };

  useEffect(() => {
    getMyInfo();
  }, []);

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
    const updateData = new FormData();
    if (form.profileImageFile) {
      updateData.append("profileImage", form.profileImageFile);
    }
    if (form.desiredPay !== desiredPay)
      updateData.append("desiredPay", String(form.desiredPay));
    if (form.experience !== experience)
      updateData.append("experience", form.experience);
    if (form.certificateName !== certificateName)
      updateData.append("certificateName", form.certificateName);
    if (form.certificateFile)
      updateData.append("certificate", form.certificateFile);

    try {
      await axiosInstance.patch("/helper/edit-profile", updateData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("수정되었습니다!");
      getMyInfo(); // 최신 데이터 다시 가져오기
    } catch (e) {
      console.error("수정 실패", e);
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
    profileImage,
  } = info;

  return (
    <MyInfoStyled className={clsx("myinfo_wrap")}>
      {profileImage && (
        <div className="myinfo_img_box">
          <img
            className="myinfo_img"
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/image/${profileImage}`}
            alt="프로필"
          />
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setForm((prev) => ({ ...prev, profileImageFile: file }));
          }
        }}
        className="myinfo_input"
      />

      <div className="myinfo_info">
        <div className="myinfo_column">
          <span className="myinfo_title">이름</span>
          <span className="myinfo_title">이메일</span>
          <span className="myinfo_title">전화번호</span>
          <span className="myinfo_title">생년월일</span>
          <span className="myinfo_title">성별</span>
          <span className="myinfo_title">희망 일급</span>
          <span className="myinfo_title">경력</span>
          <span className="myinfo_title">자격증명</span>
          {certificate && <span className="myinfo_title">자격증 PDF</span>}
        </div>
        <div className="myinfo_column">
          <span className="myinfo_content">{user.name}</span>
          <span className="myinfo_content">{user.email}</span>
          <span className="myinfo_content">{user.phone}</span>
          <span className="myinfo_content">{birth}</span>
          <span className="myinfo_content">
            {gender === "male" ? "남성" : "여성"}
          </span>
          <input
            type="number"
            name="desiredPay"
            value={form.desiredPay}
            onChange={handleChange}
            className="myinfo_input"
          />
          <textarea
            name="experience"
            value={form.experience}
            onChange={handleChange}
            className="myinfo_input"
          />
          <input
            type="text"
            name="certificateName"
            value={form.certificateName}
            onChange={handleChange}
            className="myinfo_input"
          />
          {certificate && (
            <>
              <a
                className="myinfo_content"
                href={`${process.env.NEXT_PUBLIC_API_URL}/uploads/file/${certificate}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                PDF 보기
              </a>
              <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                className="myinfo_input"
              />
            </>
          )}
        </div>
      </div>
      <button onClick={handleUpdate} className="myinfo_button">
        수정하기
      </button>
    </MyInfoStyled>
  );
};

export default MyInfo;
