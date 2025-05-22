import { useEffect, useState } from "react";
import { ChoiceWorkdayStyled } from "./styled";
import axiosInstance from "@/lib/axios";
import { Button, ConfigProvider, Modal } from "antd";
import { GreenTheme } from "@/utill/antdtheme";
import Registration from "../Registration";
import { DateType, dayMap } from "./info";

//마이페이지 > 근무일 컴포넌트
const ChoiceWorkday = () => {
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
    <ChoiceWorkdayStyled>
      {/* 근무 가능일 */}
      <div className="ChoiceWorkday_submit">
        <ConfigProvider theme={GreenTheme}>
          <Button className="mypage_btn" onClick={() => setOpen(true)}>
            근무 가능일 등록
          </Button>
        </ConfigProvider>
      </div>
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

      <Modal
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Registration possibleDate={possibleDate} setOpen={setOpen} />
      </Modal>
    </ChoiceWorkdayStyled>
  );
};

export default ChoiceWorkday;
