import Header from "@/features/Header";
import NotPc from "@/features/NotPc";
import Template from "@/layouts/Template";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { ThemeProvider } from "styled-components";
import theme from "../styles/theme";
import { useRouter } from "next/router";
import { useAuthStore } from "@/stores/useAuthStore";
import { App as AntdApp, ConfigProvider } from "antd";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [notPc, setNotPc] = useState(false);
  const isLoginPage = router.pathname === "/login"; // 현재 라우터 경로 체크
  const { isLoggedIn } = useAuthStore();

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

      <ConfigProvider>
        <AntdApp>
          {notPc ? (
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
        </AntdApp>
      </ConfigProvider>
    </>
  );
}
