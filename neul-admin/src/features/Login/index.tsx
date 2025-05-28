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
import { message } from "antd";
import React from "react";
import { Input } from "antd";

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
      if (!values.email && !values.password) {
        message.error("아이디와 비밀번호는 필수입니다.");
        return;
      }

      // email 빈 값 체크
      if (!values.email) {
        message.error("아이디는 필수입니다.");
        return;
      }

      // password 빈 값 체크
      if (!values.password) {
        message.error("비밀번호는 필수입니다.");
        return;
      }

      // password 길이 체크
      if (values.password.length < 6) {
        message.error("비밀번호는 최소 6자 이상이어야 합니다.");
        return;
      }

      // 백엔드에 보낼 email 완성
      const fullEmail = values.email + "@neul.com";

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/local`,
          {
            email: fullEmail,
            password: values.password,
          },
          {
            withCredentials: true,
          }
        );

        const { token } = res.data;

        // 1. access_token 쿠키 저장
        Cookies.set("access_token", token);

        // 2. 토큰 기반 유저 정보 요청
        const meRes = await axiosInstance.get("/auth/me");

        // 3. zustand에 로그인 상태 저장
        login(meRes.data);

        // 4. 메인페이지 이동
        router.push("/");
      } catch (error) {
        console.error("로그인 실패:", error);
        message.error("로그인 정보가 일치하지 않습니다.");
      }
    },
  });

  return (
    <LoginStyled className={clsx("Login_main_wrap")}>
      <div className="Login_main_box">
        <div className="Login_logo">
          <img src={logo.src} alt="logo" className="Login_imgstyle" />
        </div>
        <form onSubmit={loginformik.handleSubmit}>
          <div className="Login_form">
            <Input
              className="Login_input"
              type="text"
              name="email"
              placeholder="아이디"
              value={loginformik.values.email}
              onChange={loginformik.handleChange}
              suffix={
                <span style={{ userSelect: "none", color: "#999" }}>
                  @neul.com
                </span>
              }
              onBlur={loginformik.handleBlur}
            />
            <Input.Password
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
      </div>
    </LoginStyled>
  );
};

export default Login;
