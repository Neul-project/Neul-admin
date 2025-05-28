import { Button } from "antd";
import { useRouter } from "next/router";
import React from "react";
import notfound from "@/assets/images/404.png";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "84vh",
        padding: 20,
        gap: 40,
      }}
    >
      {/* 왼쪽 이미지 */}
      <div style={{ width: "200px", textAlign: "center" }}>
        <img src={notfound.src} alt="404" style={{ width: "100%" }} />
      </div>

      {/* 오른쪽 텍스트 & 버튼 */}
      <div>
        <h1 style={{ color: "#000", fontSize: "2.5rem", marginBottom: 16 }}>
          죄송합니다. 현재 찾을 수 없는 페이지를 요청하셨습니다.
        </h1>
        <p
          style={{
            color: "#666",
            fontSize: "1rem",
            lineHeight: "1.5rem",
            marginBottom: 40,
          }}
        >
          페이지의 주소가 잘못 입력되었거나,
          <br />
          주소가 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
        </p>

        <div style={{ display: "flex", gap: 16 }}>
          <Button type="primary" onClick={() => router.push("/")}>
            메인으로
          </Button>
          <Button onClick={() => router.back()}>이전으로</Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
