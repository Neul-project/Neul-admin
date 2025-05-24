import { useMemo, useState } from "react";
import { DatePicker, Checkbox, Button, message, notification } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { RegistrationStyled } from "./styled";
import axiosInstance from "@/lib/axios";

const { RangePicker } = DatePicker;

// 요일
const weekdayOptions = [
  { label: "월", value: "mon" },
  { label: "화", value: "tue" },
  { label: "수", value: "wed" },
  { label: "목", value: "thu" },
  { label: "금", value: "fri" },
  { label: "토", value: "sat" },
  { label: "일", value: "sun" },
];

type DateType = {
  startDate: string;
  endDate: string;
  week: string;
};

// 가능 날짜 등록
const Registration = ({
  possibleDate,
  setOpen,
}: {
  possibleDate?: DateType;
  setOpen: any;
}) => {
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);
  const [weekdays, setWeekdays] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const today = useMemo(() => dayjs(), []);

  const handleSuccess = (message: string, description: string) => {
    notification.success({ message, description });
    setOpen(false);
  };

  // 등록버튼 클릭시
  const posibleDateSubmit = async () => {
    if (!range[0] || !range[1]) {
      return message.warning("시작일과 종료일을 선택해주세요.");
    }
    if (weekdays.length === 0) {
      return message.warning("가능한 요일을 선택해주세요.");
    }

    const payload = {
      startDate: range[0].format("YYYY-MM-DD"), // 가능 시작 날짜
      endDate: range[1].format("YYYY-MM-DD"), // 가능 끝 날짜
      week: weekdays, // 가능 요일 배열
    };

    try {
      setLoading(true);

      // possibleDate가 있으면 patch, 없으면 post
      const method = possibleDate ? "patch" : "post";
      const url = "/helper/posibledate";
      await axiosInstance[method](url, payload);
      handleSuccess(
        possibleDate ? "날짜 수정 성공" : "날짜 등록 성공",
        possibleDate
          ? "근무 가능일이 수정되었습니다."
          : "근무 가능일이 등록되었습니다."
      );
    } catch (e) {
      notification.error({
        message: `날짜 등록 실패`,
        description: "등록 중 오류가 발생했습니다.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegistrationStyled className="registration_wrap">
      <div className="registration_title">근무 가능일 등록</div>
      <div>
        <div className="registration_date">근무 가능일 선택</div>
        <RangePicker
          value={range}
          onChange={(dates) => setRange(dates ?? [null, null])}
          picker="date"
          format="YYYY-MM-DD"
          allowClear
          disabledDate={(date) =>
            date.isSame(today, "day") || date.isBefore(today, "day")
          }
        />
      </div>

      <div>
        <div className="registration_date">가능 요일 선택</div>
        <Checkbox.Group
          options={weekdayOptions}
          value={weekdays}
          onChange={setWeekdays}
        />
      </div>

      <div className="registration_button_box">
        <Button
          className="registration_button"
          type="primary"
          onClick={posibleDateSubmit}
          loading={loading}
        >
          등록하기
        </Button>
      </div>
    </RegistrationStyled>
  );
};

export default Registration;
