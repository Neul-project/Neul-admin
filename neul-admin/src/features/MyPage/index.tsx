import TitleCompo from "@/components/TitleCompo";
import { MyPageStyled } from "./styled";
import clsx from "clsx";
import { Button, Modal } from "antd";
import Registration from "../Registration";
import { useState } from "react";
import MyInfo from "../MyInfo";

// 마이페이지
const MyPage = () => {
  const [open, setOpen] = useState(false);

  return (
    <MyPageStyled className={clsx("mypage_wrap")}>
      <TitleCompo title="마이페이지" />
      {/* 내용 */}
      <MyInfo />
      <div className="mypage_button">
        <Button onClick={() => setOpen(true)}>근무 가능 날짜 등록</Button>
      </div>

      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Registration />
      </Modal>
    </MyPageStyled>
  );
};

export default MyPage;
