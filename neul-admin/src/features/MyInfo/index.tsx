import { Button, Modal } from "antd";
import { MyInfoStyled } from "./styled";
import Registration from "../Registration";
import { useState } from "react";

// 로그인한 도우미 정보
const MyInfo = () => {
  const [open, setOpen] = useState(false);

  return (
    <MyInfoStyled>
      <div>내 정보</div>
      <Button onClick={() => setOpen(true)}>근무 가능 날짜 등록</Button>

      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Registration />
      </Modal>
    </MyInfoStyled>
  );
};

export default MyInfo;
