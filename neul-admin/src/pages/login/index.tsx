import Login from "@/features/Login";
import { message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";

const LoginPage = () => {
  const hasRun = useRef(false);

  const router = useRouter();
  const reason = router.query.reason;

  // middleware.ts에서 보낸 쿼리를 통해 alert처리
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true; // alert 한 번만 실행하기 위함

    if (reason === "auth") {
      message.info("로그인이 필요합니다.");
    }
  }, [reason]);

  return <Login />;
};

export default LoginPage;
