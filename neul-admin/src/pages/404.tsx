import React from "react";
import Link from "next/link";

const Custom404 = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "0 20px",
      }}
    >
      <h1>404 - 페이지를 찾을 수 없습니다.</h1>
      <p>찾으시는 페이지가 삭제되었거나, 주소가 잘못되었습니다.</p>
      <Link href="/">
        <a
          style={{
            color: "#0070f3",
            textDecoration: "underline",
            marginTop: 20,
          }}
        >
          홈으로 돌아가기
        </a>
      </Link>
    </div>
  );
};

export default Custom404;
