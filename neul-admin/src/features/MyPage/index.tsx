import TitleCompo from "@/components/TitleCompo";
import { MyPageStyled } from "./styled";
import clsx from "clsx";

const MyPage = () => {
  return (
    <MyPageStyled className={clsx("mypage_wrap")}>
      <TitleCompo title="마이페이지" />
    </MyPageStyled>
  );
};

export default MyPage;
