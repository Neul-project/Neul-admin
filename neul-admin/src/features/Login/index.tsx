import clsx from "clsx";
import { LoginStyled } from "./styled";
import { useFormik } from "formik";
import axios from "axios";
import Cookies from "js-cookie";

//image
import logo from "@/assets/images/logo.png";
import axiosInstance from "@/lib/axios";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/useAuthStore";
import { loginSchema } from "@/utill/joinValidation";

//login 컴포넌트
const Login = () => {
  const router = useRouter();
  const { login } = useAuthStore();
  const loginformik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      //console.log("value", values);

      const val_email = values.email;

      if (val_email.split("@")[1] === "neul.com") {
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/local`,
            values,
            {
              withCredentials: true,
            }
          );

          //console.log("로그인 응답 데이터", res.data);

          const { user, token } = res.data;

          // 1. access_token 쿠키 저장
          Cookies.set("access_token", token);

          // 2. 토큰 기반 유저 정보 요청
          const meRes = await axiosInstance.get("/auth/me");

          //console.log("유저 정보:", meRes.data);

          // 3. zustand에 로그인 상태 저장
          login(meRes.data); // user: { id }

          // 4. 메인페이지 이동
          router.push("/");
        } catch (error) {
          console.error("로그인 실패:", error);
          alert("로그인 정보가 일치하지 않습니다.");
        }
      } else {
        alert("유효하지 않은 계정입니다.");
        return;
      }
    },
    validationSchema: loginSchema,
  });

  return (
    <LoginStyled className={clsx("Login_main_wrap")}>
      <div className="Login_logo">
        <img src={logo.src} alt="logo" className="Login_imgstyle" />
      </div>
      <form onSubmit={loginformik.handleSubmit}>
        <div className="Login_form">
          <input
            className="Login_input"
            type="email"
            name="email"
            placeholder="이메일"
            value={loginformik.values.email}
            onChange={loginformik.handleChange}
            onBlur={loginformik.handleBlur}
          />
          <input
            className="Login_input"
            type="password"
            name="password"
            placeholder="비밀번호"
            value={loginformik.values.password}
            onChange={loginformik.handleChange}
            onBlur={loginformik.handleBlur}
          />
        </div>
        <div>
          <button type="submit" className="Login_btn">
            로그인
          </button>
        </div>
      </form>
    </LoginStyled>
  );
};

export default Login;
