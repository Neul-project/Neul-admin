import { Button } from "antd";
import { useRouter } from "next/router";
import React from "react";
import notfound from "@/assets/images/404.png";
import styles from "./404.module.css";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      {/* 왼쪽 이미지 */}
      <div className={styles.imageBox}>
        <img src={notfound.src} alt="404" style={{ width: "100%" }} />
      </div>

      {/* 오른쪽 텍스트 + 버튼 */}
      <div className={styles.textBox}>
        <h1 className={styles.title}>
          죄송합니다.
          <br />
          현재 찾을 수 없는 페이지를 요청하셨습니다.
        </h1>
        <p className={styles.description}>
          페이지의 주소가 잘못 입력되었거나,
          <br />
          주소가 변경 혹은 삭제되어 요청하신 페이지를 찾을 수 없습니다.
        </p>

        <div className={styles.buttons}>
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
