import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { HeaderStyled } from "./styled";
import clsx from "clsx";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button, Modal, Tooltip } from "antd";
import Cookies from "js-cookie";
import { HomeFilled } from "@ant-design/icons";

export interface HeaderProps {
  className?: string;
}

//해당하는 URL은 Header가 표시되지 않습니다.
export const nonePageObject = ["/login"];

const Header = ({ className }: HeaderProps) => {
  // 라우터
  const router = useRouter();
  // 현재 경로
  const pathname = router?.pathname;

  const { user } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    useAuthStore.getState().logout();
    Cookies.remove("access_token");
    router.push("/login");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <HeaderStyled
      className={clsx(
        "Header",
        nonePageObject.some((x) => {
          if (x === "/") {
            return pathname === "/";
          }
          return pathname.includes(x);
        }) && "headerOff",
        className
      )}
    >
      <div className="navigation">
        <div className="left">
          <Link href="/">도우미 페이지</Link>
        </div>
        <div className="right">
          <Tooltip title="메인페이지 이동">
            <span
              className="header_home"
              onClick={() => {
                window.location.href = process.env.NEXT_PUBLIC_BASE_URL + "/";
              }}
            >
              <HomeFilled />
            </span>
          </Tooltip>
          <span className="header_userinfo">{user?.name}님</span>
          <span className="header_logout" onClick={showModal}>
            로그아웃
          </span>
        </div>
        <Modal
          title="로그아웃"
          closable={false}
          open={isModalOpen}
          centered
          footer={[
            <Button key="close" onClick={handleCancel}>
              취소
            </Button>,
            <Button key="complete" type="primary" onClick={handleOk}>
              로그아웃
            </Button>,
          ]}
        >
          <div>정말로 로그아웃 하시겠습니까?</div>
        </Modal>
      </div>
    </HeaderStyled>
  );
};

export default Header;
