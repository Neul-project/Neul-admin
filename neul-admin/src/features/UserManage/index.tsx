import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import TitleCompo from "@/components/TitleCompo";
import axiosInstance from "@/lib/axios";
import { UserManageStyled } from "./styled";
import { formatPhoneNumber } from "@/utill/formatter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { useAuthStore } from "@/stores/useAuthStore";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
dayjs.locale("ko");
import {
  Button,
  Modal,
  Select,
  Table,
  Input,
  notification,
  Calendar,
  ConfigProvider,
} from "antd";
import koKR from "antd/locale/ko_KR";

dayjs.extend(isSameOrBefore);
const { Search } = Input;

interface UserType {
  id: number;
  email: string;
  name: string;
  phone: string;
  patient_id: number;
  patient_name: string;
  patient_gender: string;
  patient_birth: string;
  patient_note: string;
  dates: string;
  matcing_at: string;
  key: number;
}

const UserManage = () => {
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);
  const [userOrder, setUserOrder] = useState("DESC");
  const [selectSearch, setSelectSearch] = useState<string>("user_id");
  const [calendarValue, setCalendarValue] = useState<Dayjs | null>(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const adminId = useAuthStore((state) => state.user?.id);

  // 검색으로 담당 유저 중 해당하는 사람만 불러오기(만약 검색단어가 없을시 전체 유저 불러오기)
  const fetchUsers = useCallback(
    async (word: string = "") => {
      try {
        const res = await axiosInstance.get("/matching/search", {
          params: {
            adminId,
            search: selectSearch, // 어떤 기준으로 검색하는지(user_id->보호자ID, user_name->보호자 이름, patient_name->피보호자 이름)
            word: word.trim(), // 검색 단어
          },
        });

        const mapped = res.data.map((x: any, i: number) => ({
          key: i,
          id: x.user.id,
          number: i + 1,
          email: x.user.email,
          name: x.user.name,
          phone: x.user.phone,
          patient_id: x.patient.id,
          patient_name: x.patient.name,
          patient_gender: x.patient.gender === "male" ? "남" : "여",
          patient_birth: x.patient.birth || "없음",
          patient_note: x.patient.note || "없음",
          dates: x.apply.dates,
          matcing_at: x.match.matching_at, // 매칭된 날짜
        }));

        setUsers(mapped);
      } catch (e) {
        console.error("검색 실패: ", e);
        notification.error({
          message: "검색 실패",
          description: "검색에 실패하였습니다.",
        });
      }
    },
    [selectSearch, adminId]
  );

  // 날짜 달력에 표시
  const matchedDates = useMemo(() => {
    if (!selectedUser?.dates) return [];

    const groups = selectedUser.dates.split("/"); // 신청 그룹별 분리
    const dateSet = new Set<string>();

    groups.forEach((group) => {
      group.split(",").forEach((dateStr) => {
        dateSet.add(dayjs(dateStr.trim()).format("YYYY-MM-DD"));
      });
    });

    return Array.from(dateSet); // 중복 제거
  }, [selectedUser]);

  // 첫 날짜
  const earliestDates = useMemo(() => {
    if (!selectedUser?.dates) return [];

    // '/' 기준으로 그룹 분리
    const groups = selectedUser.dates.split("/");

    // 각 그룹별로 ',' 기준으로 날짜 분리 후 가장 빠른 날짜 구하기
    return groups.map((group) => {
      const dates = group.split(",").map((d) => dayjs(d.trim()));
      return dates.reduce(
        (min, curr) => (curr.isBefore(min) ? curr : min),
        dates[0]
      );
    });
  }, [selectedUser]);

  // 그룹별 가장 빠른 날짜 중에서도 가장 빠른 날짜 하나만 골라내기
  const earliestMatchedDate = useMemo(() => {
    if (earliestDates.length === 0) return undefined;
    return earliestDates.reduce(
      (min, curr) => (curr.isBefore(min) ? curr : min),
      earliestDates[0]
    );
  }, [earliestDates]);

  useEffect(() => {
    if (!adminId) return;
    // 검색어 없이 전체 유저 로딩
    fetchUsers("");
  }, [adminId, fetchUsers]);

  // 유저 정렬하기
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const timeA = new Date(a.matcing_at).getTime();
      const timeB = new Date(b.matcing_at).getTime();
      return userOrder === "DESC" ? timeB - timeA : timeA - timeB;
    });
  }, [users, userOrder]);

  const onSearch = useCallback(
    (value: string) => {
      fetchUsers(value);
    },
    [fetchUsers]
  );

  // 엑셀 다운로드
  const handleDownloadExcel = () => {
    const headers = [
      "보호자ID",
      "보호자_아이디",
      "보호자명",
      "보호자_전화번호",
      "피보호자ID",
      "피보호자명",
      "피보호자_성별",
      "피보호자_생년월일",
      "피보호자_특이사항",
    ];

    const rows = users.map((user) => [
      user.id,
      user.email,
      user.name,
      user.phone,
      user.patient_id,
      user.patient_name,
      user.patient_gender,
      user.patient_birth,
      user.patient_note,
    ]);

    const sheetData = [headers, ...rows];

    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "회원목록");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "담당회원목록.xlsx");
  };

  const columns = useMemo(
    () => [
      {
        key: "number",
        title: "번호",
        render: (_: any, __: any, index: number) => {
          // 페이지네이션 기준 계산
          return (pagination.current - 1) * pagination.pageSize + index + 1;
        },
      },
      {
        key: "email",
        title: "아이디",
        dataIndex: "email",
      },
      {
        key: "user",
        title: "보호자명 (ID)",
        render: (record: any) =>
          record.name
            ? `${record.name} (${record.id})`
            : `없음 (${record.id || "없음"})`,
      },
      {
        key: "phone",
        title: "전화번호",
        render: (record: any) => formatPhoneNumber(record.phone),
      },
      {
        key: "patient_name",
        title: "피보호자명 (ID)",
        render: (record: any) =>
          record.patient_name
            ? `${record.patient_name} (${record.patient_id})`
            : `없음 (${record.patient_id || "없음"})`,
      },
      {
        key: "patient_gender",
        title: "성별",
        dataIndex: "patient_gender",
      },
      {
        key: "patient_birth",
        title: "생년월일",
        dataIndex: "patient_birth",
      },
    ],
    [pagination]
  );

  const sortOption = [
    { value: "DESC", label: "최신순" },
    { value: "ASC", label: "오래된순" },
  ];

  const searchOption = [
    { value: "user_id", label: "보호자 ID" },
    { value: "user_name", label: "보호자 이름" },
    { value: "patient_name", label: "피보호자 이름" },
  ];

  const handleChange = (value: string) => {
    // 선택된 검색 셀렉트
    setSelectSearch(value);
  };

  return (
    <UserManageStyled className={clsx("usermanage_wrap")}>
      <div className="usermanage_title_box">
        <TitleCompo title="담당 회원" />
        <Button onClick={handleDownloadExcel}>엑셀 다운로드</Button>
      </div>

      <div className="usermanage_info">
        <div className="usermanage_sort_box">
          <div className="usermanage_total_num">총 {users.length}명</div>
          <Select
            className="usermanage_order"
            value={userOrder}
            options={sortOption}
            onChange={(e) => {
              setUserOrder(e);
            }}
          />
        </div>
        <div>
          <Select
            className="usermanage_search_select"
            value={selectSearch}
            options={searchOption}
            onChange={handleChange}
          />
          <Search
            placeholder="선택한 기준으로 검색"
            allowClear
            onSearch={onSearch}
            style={{ width: 200 }}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={sortedUsers}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            setPagination({ current: page, pageSize });
          },
        }}
        rowKey="key"
        onRow={(record) => ({
          onClick: () => {
            setSelectedUser(record); // 클릭한 유저 데이터
            setModalOpen(true); // 모달 열기
          },
        })}
      />
      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        centered
      >
        {modalOpen && selectedUser && (
          <ConfigProvider locale={koKR}>
            <h3>특이사항</h3>
            <p>{selectedUser.patient_note}</p>
            <br />
            <h3>배정일</h3>
            <Calendar
              fullscreen={false}
              value={calendarValue || (earliestMatchedDate ?? dayjs())}
              onSelect={(date) => setCalendarValue(date)}
              cellRender={(value: Dayjs) => {
                const isMatched = matchedDates.includes(
                  value.format("YYYY-MM-DD")
                );
                return isMatched ? (
                  <div style={{ color: "#79b79d", textAlign: "center" }}>
                    배정일
                  </div>
                ) : null;
              }}
            />
          </ConfigProvider>
        )}
      </Modal>
    </UserManageStyled>
  );
};

export default UserManage;
