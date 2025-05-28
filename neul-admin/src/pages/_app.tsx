import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import theme from "../styles/theme";
import { useRouter } from "next/router";
import { ConfigProvider } from "antd";
import { GreenTheme } from "@/utill/antdtheme";
import dynamic from "next/dynamic";
import SystemDown from "@/components/SystemDown";
import axios from "axios";

// 렌더링 시점에서만 불러옴
const Header = dynamic(() => import("@/features/Header"));
const Template = dynamic(() => import("@/layouts/Template"));
const NotPc = dynamic(() => import("@/features/NotPc"), { ssr: false });

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [notPc, setNotPc] = useState(false);
  const [isServerDown, setIsServerDown] = useState(false); // 서버 상태 체크

  const isLoginPage = router.pathname === "/login"; // 현재 라우터 경로 체크

  // 서버 체크
  const checkServer = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/health`
      ); // 백엔드의 헬스 체크
      // 응답이 200이고 ok가 true일 때만 서버 정상으로 판단
      if (res.status === 200 && res.data.ok === true) {
        setIsServerDown(false);
      } else {
        setIsServerDown(true);
      }
    } catch (error) {
      setIsServerDown(true);
    }
  };

  useEffect(() => {
    checkServer();
    // 30초마다 서버 상태 확인
    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1200) {
        setNotPc(true);
      } else {
        setNotPc(false);
      }
    };

    // 초기 width 확인
    handleResize();

    // resize 이벤트 리스너 추가
    window.addEventListener("resize", handleResize);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Head>
        <title>도우미</title>
      </Head>

      <ConfigProvider theme={GreenTheme}>
        {isServerDown ? (
          <SystemDown />
        ) : notPc ? (
          <NotPc />
        ) : isLoginPage ? (
          <Component {...pageProps} />
        ) : (
          <ThemeProvider theme={theme}>
            <Header />
            <Template>
              <Component {...pageProps} />
            </Template>
          </ThemeProvider>
        )}
      </ConfigProvider>
    </>
  );
}
