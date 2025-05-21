import TitleCompo from "@/components/TitleCompo";
import { MyPageStyled } from "./styled";
import clsx from "clsx";
import MyInfo from "../MyInfo";

// 마이페이지
const MyPage = () => {
  return (
    <MyPageStyled className={clsx("mypage_wrap")}>
      <TitleCompo title="마이페이지" />
      <div className="mypage_box">
        {/* 내용 */}
        <MyInfo />
      </div>
    </MyPageStyled>
  );
};

export default MyPage;
