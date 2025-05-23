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
        <div className="ChoiceWorkday_main">
          <div className="ChoiceWorkday_days">
            <div className="ChoiceWorkday_title">근무 가능일</div>
            <div>
              {possibleDate?.startDate} ~ {possibleDate?.endDate}
            </div>
          </div>
          <div className="ChoiceWorkday_we">
            <div className="ChoiceWorkday_title">근무 가능 요일</div>
            <div>
              {possibleDate?.week
                .split(",")
                .map((day) => dayMap[day])
                .join(", ")}
            </div>
          </div>
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
