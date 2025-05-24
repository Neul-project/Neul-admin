import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { formatPhoneNumber } from "@/utill/formatter";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface ScheduleItem {
  sortedAvailableDates: string[];
  id: number;
  userId: number;
  userName: string;
  phone: string;
  patientId: number;
  patientName: string;
  availableDate: string;
}

const SchedulePage = () => {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);

  // 일정 가져오기
  const fetchSchedules = async () => {
    try {
      const res = await axiosInstance.get("/matching/schedule");

      // 정제 및 정렬된 형태로 가공
      const processed = res.data.map((item: ScheduleItem) => {
        const sortedDates = item.availableDate
          .split(",")
          .map((d) => d.trim())
          .sort((a, b) => dayjs(a).unix() - dayjs(b).unix());

        return {
          ...item,
          sortedAvailableDates: sortedDates, // 여기에 정렬된 날짜 배열 추가
        };
      });

      setSchedules(processed);
    } catch (e) {
      console.error("일정 조회 실패:", e);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // 일정 수가 많아져도 O(1)로 특정 날짜에 해당하는 일정 조회 가능
  const scheduleMap = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>();
    schedules.forEach((item) => {
      item.availableDate.split(",").forEach((date) => {
        const key = date.trim();
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(item);
      });
    });
    return map;
  }, [schedules]);

  // 날짜 범위 내에 포함된 일정만 필터링
  const getSchedulesByDate = useCallback(
    (date: Dayjs) => {
      return scheduleMap.get(date.format("YYYY-MM-DD")) || [];
    },
    [scheduleMap]
  );

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

  const handleSelect = useCallback((date: Dayjs) => {
    setSelectedDate(date);
  }, []);

  return (
    <ConfigProvider locale={koKR}>
      <SchedulePageStyled className={clsx("schedule_wrap")}>
        <TitleCompo title="일정표" />

        {/* 달력 */}
        <Calendar
          fullscreen={true}
          cellRender={cellRender}
          onSelect={handleSelect}
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
                        <span className="schedule_user">
                          {/* 보호자 */}
                          {item.userName}({item.userId})보호자님
                        </span>
                      </span>
                      <span className="schedule_date">
                        {(() => {
                          const dates = item.sortedAvailableDates; // 정렬된 배열을 그대로 사용
                          return dates.length === 1
                            ? dates[0]
                            : `${dates[0]} ~ ${dates[dates.length - 1]}`;
                        })()}
                      </span>
                    </div>
                  </div>
                  {/* 연락처 */}
                  <div className="schedule_phone">
                    보호자 연락처: {formatPhoneNumber(item.phone)}
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
