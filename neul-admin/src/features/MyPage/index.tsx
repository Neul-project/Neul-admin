import TitleCompo from "@/components/TitleCompo";
import { MyPageStyled } from "./styled";
import clsx from "clsx";
import { ConfigProvider, Tabs } from "antd";
import { items } from "./info";
import { GreenTheme } from "@/utill/antdtheme";

// 마이페이지
const MyPage = () => {
  return (
    <MyPageStyled className={clsx("mypage_wrap")}>
      <TitleCompo title="마이페이지" />
      <div className="mypage_tabs">
        <ConfigProvider theme={GreenTheme}>
          <Tabs type="card" items={items} />
        </ConfigProvider>
      </div>
    </MyPageStyled>
  );
};

export default MyPage;
