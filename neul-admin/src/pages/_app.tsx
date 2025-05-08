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

  useEffect(() => {
    // 로그인 페이지를 제외한 모든 페이지에서 로그인 여부를 확인
    if (!isLoggedIn && router.pathname !== "/login") {
      alert("로그인 후 사용이 가능합니다.");
      router.replace("/login");
    }
  }, [isLoggedIn, router]);

  return (
    <>
      <Head>
        <title>관리자</title>
      </Head>

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
    </>
  );
}
