import { useEffect, useState } from "react";
import { ChoiceWorkdayStyled } from "./styled";
import axiosInstance from "@/lib/axios";
import { Button, ConfigProvider, Modal, Calendar } from "antd";
import { GreenTheme } from "@/utill/antdtheme";
import Registration from "../Registration";
import { DateType, dayMap } from "./info";
import { useAuthStore } from "@/stores/useAuthStore";
import dayjs, { Dayjs } from "dayjs";

const weekStringToNumberMap: { [key: string]: number } = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
};

//마이페이지 > 근무일 컴포넌트
const ChoiceWorkday = () => {
  const [open, setOpen] = useState(false); //근무 가능일 등록 모달 여부
  const [possibleDate, setPossibleDate] = useState<DateType>(); //근무일 데이터 가져오기

  const helperId = useAuthStore((state) => state.user?.id);

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
  }, [open]);

  // 날짜가 possibleDate 범위 내인지 확인
  const isInRange = (date: Dayjs) => {
    if (!possibleDate) return false;
    const start = dayjs(possibleDate.startDate);
    const end = dayjs(possibleDate.endDate);
    return (
      date.isSame(start, "day") ||
      date.isSame(end, "day") ||
      (date.isAfter(start, "day") && date.isBefore(end, "day"))
    );
  };

  // 날짜가 가능한 요일인지 확인
  const isWorkday = (date: Dayjs) => {
    if (!possibleDate) return false;
    const allowedDays = possibleDate.week.split(","); // ["mon","tue","thu"]
    const dayNum = date.day(); // 0 (일) ~ 6 (토)
    // allowedDays에는 영문 소문자 3자리임. map에서 숫자로 바꿔서 비교
    return allowedDays.some((d) => weekStringToNumberMap[d] === dayNum);
  };

  // 달력의 각 날짜 셀에 표시할 내용
  const dateCellRender = (value: Dayjs) => {
    if (isInRange(value) && isWorkday(value)) {
      return (
        <div
          style={{
            margin: 2,
            padding: 4,
            backgroundColor: "#5DA487",
            color: "white",
            borderRadius: 4,
            textAlign: "center",
            cursor: "pointer",
          }}
        >
          근무 가능
        </div>
      );
    }
    return null;
  };

  return (
    <ChoiceWorkdayStyled>
      <div className="ChoiceWorkday_submit">
        <ConfigProvider theme={GreenTheme}>
          <Button className="mypage_btn" onClick={() => setOpen(true)}>
            근무 가능일 등록
          </Button>
        </ConfigProvider>
      </div>

      {possibleDate ? (
        <>
          <Calendar dateCellRender={dateCellRender} fullscreen={false} />
          <div className="ChoiceWorkday_content">
            <div>
              근무 가능 기간 : {possibleDate.startDate} ~ {possibleDate.endDate}
            </div>
            <div>
              근무 가능 요일 :
              {possibleDate.week
                .split(",")
                .map((day) => dayMap[day])
                .join(", ")}
            </div>
          </div>
        </>
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
