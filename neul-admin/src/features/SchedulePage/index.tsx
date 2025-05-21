import React, { useEffect, useState } from "react";
import { Calendar, ConfigProvider } from "antd";
import type { CalendarProps } from "antd";
import type { Dayjs } from "dayjs";
import koKR from "antd/locale/ko_KR";
import dayjs from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");
import TitleCompo from "@/components/TitleCompo";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { SchedulePageStyled } from "./styled";
import clsx from "clsx";
import { CalendarOutlined } from "@ant-design/icons";
import axiosInstance from "@/lib/axios";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface ScheduleItem {
  id: number;
  userId: number;
  userName: string;
  phone: string;
  patientId: number;
  patientName: string;
  availableFrom: string; // 'YYYY-MM-DD'
  availableTo: string; // 'YYYY-MM-DD'
}

const SchedulePage = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // 일정 가져오기
  const fetchSchedules = async () => {
    try {
      const res = await axiosInstance.get("/matching/schedule");
      setSchedules(res.data);
    } catch (e) {
      console.error("일정 조회 실패:", e);
    }
  };

  useEffect(() => {
    fetchSchedules();
    // setSchedules([
    //   {
    //     id: 1,
    //     userId: 101,
    //     userName: "김선",
    //     phone: "010-1234-5678",
    //     patientId: 201,
    //     patientName: "이수",
    //     availableFrom: "2025-05-21",
    //     availableTo: "2025-05-21",
    //   },
    //   {
    //     id: 2,
    //     userId: 101,
    //     userName: "김길",
    //     phone: "010-1234-5678",
    //     patientId: 202,
    //     patientName: "박박",
    //     availableFrom: "2025-05-22",
    //     availableTo: "2025-05-25",
    //   },
    //   {
    //     id: 3,
    //     userId: 101,
    //     userName: "김백",
    //     phone: "010-1234-5678",
    //     patientId: 203,
    //     patientName: "최현",
    //     availableFrom: "2025-05-22",
    //     availableTo: "2025-05-22",
    //   },
    // ]);
  }, []);

  // 날짜 범위 내에 포함된 일정만 필터링
  const getSchedulesByDate = (date: Dayjs) =>
    schedules.filter((item) => {
      const target = date.format("YYYY-MM-DD");
      return (
        dayjs(target).isSameOrAfter(item.availableFrom) &&
        dayjs(target).isSameOrBefore(item.availableTo)
      );
    });

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") {
      const daySchedules = getSchedulesByDate(current);
      return (
        <ul className="schedule_events">
          {daySchedules.map((item) => (
            <li key={item.id}>
              <div className="schedule_bar" />
              <span className="schedule_name">{item.patientName}</span>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  return (
    <ConfigProvider locale={koKR}>
      <SchedulePageStyled className={clsx("schedule_wrap")}>
        <TitleCompo title="일정표" />

        {/* 달력 */}
        <Calendar
          fullscreen={true}
          cellRender={cellRender}
          onSelect={(date) => setSelectedDate(date)}
        />

        {/* 해당 날짜 일정 */}
        {selectedDate && (
          <div className="schedule_select">
            <div className="schedule_content_title">
              {selectedDate.format("YYYY-MM-DD")} 일정
            </div>
            {getSchedulesByDate(selectedDate).length === 0 ? (
              <p>일정이 없습니다.</p>
            ) : (
              getSchedulesByDate(selectedDate).map((item) => (
                <div key={item.id} className="schedule_item">
                  <div className="schedule_content_box">
                    <CalendarOutlined className="schedule_calender_icon" />
                    <div className="schedule_content">
                      <span className="schedule_patient">
                        {/* 피보호자 */}
                        {item.patientName}({item.patientId}) -
                        <span>
                          {/* 보호자 */}
                          {item.userName}({item.userId})보호자님
                        </span>
                      </span>
                      <span className="schedule_date">
                        {item.availableFrom === item.availableTo
                          ? item.availableFrom
                          : `${item.availableFrom} - ${item.availableTo}`}
                      </span>
                    </div>
                  </div>
                  {/* 연락처 */}
                  <div className="schedule_phone">
                    보호자 연락처: {item.phone}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </SchedulePageStyled>
    </ConfigProvider>
  );
};

export default SchedulePage;
