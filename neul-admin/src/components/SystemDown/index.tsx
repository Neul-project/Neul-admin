import React from "react";
import heathcheck from "@/assets/images/check.png";
import { SystemDownStyled } from "./styled";

const SystemDown = () => {
  return (
    <SystemDownStyled className="systemdown_wrap">
      {/* 위쪽 이미지 */}
      <div className="systemdown_imgbox">
        <img src={heathcheck.src} alt="heathcheck" style={{ width: "100%" }} />
      </div>

      {/* 아래쪽 텍스트 */}
      <div className="systemdown_textbox">
        <h1 className="systemdown_title">
          시스템 점검 중입니다.
          <br />
          서버 점검 중이니 잠시 후 다시 시도해 주세요.
        </h1>
      </div>
    </SystemDownStyled>
  );
};

export default SystemDown;
