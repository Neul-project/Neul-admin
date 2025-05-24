import { useEffect, useState } from "react";
import { ChoiceWorkdayStyled } from "./styled";
import axiosInstance from "@/lib/axios";
import { Button, ConfigProvider, Modal } from "antd";
import { GreenTheme } from "@/utill/antdtheme";
import Registration from "../Registration";
import { DateType, dayMap } from "./info";
import { useAuthStore } from "@/stores/useAuthStore";

//마이페이지 > 근무일 컴포넌트
const ChoiceWorkday = () => {
  const [open, setOpen] = useState(false);
  const [possibleDate, setPossibleDate] = useState<DateType>();

  const helperId = useAuthStore((state) => state.user?.id);

  // 근무 가능일 가져오기 요청
  const getDate = async () => {
    try {
      const res = await axiosInstance.get(`/helper/time/${helperId}`);
      setPossibleDate(res.data);
    } catch (e) {
      console.error("근무 가능일 가져오기 실패: ", e);
    }
  };

  useEffect(() => {
    getDate();
  }, []); // 원래는 possibleDate게 있었으나 무한 렌더링 되고 있음

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
