import TitleCompo from "@/components/TitleCompo";
import { MyPageStyled } from "./styled";
import clsx from "clsx";
import { Button, Modal } from "antd";
import Registration from "../Registration";
import { useEffect, useState } from "react";
import MyInfo from "../MyInfo";
import axiosInstance from "@/lib/axios";

type DateType = {
  availableFrom: string;
  availableTo: string;
  date: string;
};

// 마이페이지
const MyPage = () => {
  const [open, setOpen] = useState(false);
  const [possibleDate, setPossibleDate] = useState<DateType>();

  // 근무 가능일 가져오기 요청
  const getDate = async () => {
    try {
      const res = await axiosInstance.get("/helper/posibledate");
      console.log("가능일임", res.data);

      setPossibleDate(res.data);
    } catch (e) {
      console.error("근무 가능일 가져오기 실패: ", e);
    }
  };

  useEffect(() => {
    getDate();
  }, []);

  return (
    <MyPageStyled className={clsx("mypage_wrap")}>
      <TitleCompo title="마이페이지" />
      {/* 내용 */}
      <MyInfo />
      <div className="mypage_button">
        {possibleDate ? (
          <div>
            근무 가능일 {possibleDate?.availableFrom} -{" "}
            {possibleDate?.availableTo}
            <br />
            근무 가능 요일 {possibleDate?.date}
          </div>
        ) : (
          "근무 가능일을 등록해주세요"
        )}

        <Button onClick={() => setOpen(true)}>근무 가능일 등록</Button>
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
