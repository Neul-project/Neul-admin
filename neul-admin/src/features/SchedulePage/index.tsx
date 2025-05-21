import React, { useEffect, useState } from "react";
import { Calendar, Badge, Button, FloatButton, ConfigProvider } from "antd";
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
import { CalendarOutlined, PlusOutlined } from "@ant-design/icons";
import axiosInstance from "@/lib/axios";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface ScheduleItem {
  id: number;
  userId: number;
  userName: string;
  patientId: number;
  patientName: string;
  startDate: string; // 'YYYY-MM-DD'
  endDate: string; // 'YYYY-MM-DD'
}

const SchedulePage = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // 일정 가져오기
  const fetchSchedules = async () => {
    try {
      const res = await axiosInstance.get("/admin/schedule");
      setSchedules(res.data);
    } catch (e) {
      console.error("일정 조회 실패:", e);
    }
  };

  // 일정 삭제하기
  const deleteSchedule = async (scheduleId: number) => {
    try {
      await axiosInstance.delete(`/admin/schedule/${scheduleId}`);
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleId));
    } catch (error) {
      console.error("삭제 실패:", error);
    }
  };

  useEffect(() => {
    // fetchSchedules();
    setSchedules([
      {
        id: 1,
        userId: 101,
        userName: "김보호자",
        patientId: 201,
        patientName: "이피보호자",
        startDate: "2025-05-21",
        endDate: "2025-05-21",
      },
      {
        id: 2,
        userId: 101,
        userName: "김보호자",
        patientId: 202,
        patientName: "박피보호자",
        startDate: "2025-05-22",
        endDate: "2025-05-25",
      },
      {
        id: 3,
        userId: 101,
        userName: "김보호자",
        patientId: 203,
        patientName: "최피보호자",
        startDate: "2025-05-22",
        endDate: "2025-05-22",
      },
    ]);
  }, []);

  // 날짜 범위 내에 포함된 일정만 필터링
  const getSchedulesByDate = (date: Dayjs) =>
    schedules.filter((item) => {
      const target = date.format("YYYY-MM-DD");
      return (
        dayjs(target).isSameOrAfter(item.startDate) &&
        dayjs(target).isSameOrBefore(item.endDate)
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
        <Calendar
          fullscreen={true}
          cellRender={cellRender}
          onSelect={(date) => setSelectedDate(date)}
        />

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
                      {/* 피보호자 */}
                      <span className="schedule_patient">
                        {item.patientName}({item.patientId}) -
                        <span>
                          {item.userName}({item.userId})보호자님
                        </span>
                      </span>
                      <span className="schedule_date">
                        {item.startDate === item.endDate
                          ? item.startDate
                          : `${item.startDate} - ${item.endDate}`}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={
                      () => deleteSchedule(item.id)
                      // setSchedules((prev) =>
                      //   prev.filter((s) => s.id !== item.id)
                      // )
                    }
                  >
                    삭제
                  </Button>
                </div>
              ))
            )}
          </div>
        )}

        {/* <FloatButton
          type="primary"
          tooltip="일정 추가"
          icon={<PlusOutlined />}
          onClick={() => alert("추가기능")}
        /> */}
      </SchedulePageStyled>
    </ConfigProvider>
  );
};

export default SchedulePage;
