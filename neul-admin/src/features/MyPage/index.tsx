import TitleCompo from "@/components/TitleCompo";
import { MyPageStyled } from "./styled";
import clsx from "clsx";
import { Button, ConfigProvider, Modal } from "antd";
import Registration from "../Registration";
import { useEffect, useState } from "react";
import MyInfo from "../MyInfo";
import axiosInstance from "@/lib/axios";
import { GreenTheme } from "@/utill/antdtheme";

type DateType = {
  startDate: string;
  endDate: string;
  week: string;
};

const dayMap: Record<string, string> = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
};

// 마이페이지
const MyPage = () => {
  const [open, setOpen] = useState(false);
  const [possibleDate, setPossibleDate] = useState<DateType>();

  // 근무 가능일 가져오기 요청
  const getDate = async () => {
    try {
      const res = await axiosInstance.get("/helper/posibledate");
      setPossibleDate(res.data);
    } catch (e) {
      console.error("근무 가능일 가져오기 실패: ", e);
    }
  };

  useEffect(() => {
    getDate();
  }, [possibleDate]);

  return (
    <MyPageStyled className={clsx("mypage_wrap")}>
      <TitleCompo title="마이페이지" />
      {/* 내용 */}
      <MyInfo />

      {/* 근무 가능일 */}
      <div className="mypage_btn_box">
        {possibleDate ? (
          <div>
            근무 가능일: {possibleDate?.startDate} - {possibleDate?.endDate}
            <br />
            근무 가능 요일:
            {possibleDate?.week
              .split(",")
              .map((day) => dayMap[day])
              .join(", ")}
          </div>
        ) : (
          "근무 가능일을 등록해주세요"
        )}
        <ConfigProvider theme={GreenTheme}>
          <Button className="mypage_btn" onClick={() => setOpen(true)}>
            근무 가능일 등록
          </Button>
        </ConfigProvider>
      </div>

      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Registration possibleDate={possibleDate} setOpen={setOpen} />
      </Modal>
    </MyPageStyled>
  );
};

export default MyPage;
