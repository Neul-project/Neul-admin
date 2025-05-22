import { useEffect, useState } from "react";
import {
  Button,
  message,
  Modal,
  Select,
  Table,
  Input,
  notification,
  ConfigProvider,
} from "antd";
import clsx from "clsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import TitleCompo from "@/components/TitleCompo";
import axiosInstance from "@/lib/axios";
import { UserManageStyled } from "./styled";
import { useAuthStore } from "@/stores/useAuthStore";
import type { SearchProps } from "antd/es/input";
import { GreenTheme } from "@/utill/antdtheme";
import { formatPhoneNumber } from "@/utill/formatter";
const { Search } = Input;

const UserManage = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [userOrder, setUserOrder] = useState("DESC");
  const [sortKey, setSortKey] = useState("matcing_at");
  const [sortedUsers, setSortedUsers] = useState<any[]>([]);
  const [selectSearch, setSelectSearch] = useState<string>("user_id");
  const adminId = useAuthStore((state) => state.user?.id);

  const getUserList = async () => {
    try {
      // 매칭된 user불러오기
      const res = await axiosInstance.get("/matching/matchuser");
      const data = res.data;
      console.log(data);

      const mapped = data.map((x: any) => ({
        key: x.user_id,
        id: x.user_id,
        email: x.user_email,
        name: x.user_name,
        phone: x.user_phone,
        patient_id: x.patient_id,
        patient_name: x.patient_name,
        patient_gender: x.patient_gender === "male" ? "남" : "여",
        patient_birth: x.patient_birth || "없음",
        patient_note: x.patient_note || "없음",
        availableFrom: x.availableFrom, // 'YYYY-MM-DD'
        availableTo: x.availableTo, // 'YYYY-MM-DD'
        matcing_at: x.matcing_at, // 매칭된 날짜
        created_at: x.user_create,
      }));

      setUsers(mapped);
    } catch (err) {
      console.error("담당 유저 불러오기 실패", err);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

  // 유저 정렬하기
  const sortUsers = () => {
    let sorted = [...users];

    if (sortKey === "matcing_at") {
      sorted.sort((a, b) =>
        userOrder === "DESC"
          ? new Date(b.matcing_at).getTime() - new Date(a.matcing_at).getTime()
          : new Date(a.matcing_at).getTime() - new Date(b.matcing_at).getTime()
      );
    }
    setSortedUsers(sorted);
  };

  // 유저정렬
  useEffect(() => {
    sortUsers();
  }, [userOrder, sortKey, users]);

  // 엑셀 다운
  const handleDownloadExcel = () => {
    const excelData = users.map((user) => ({
      보호자ID: user.id,
      보호자_아이디: user.email,
      보호자명: user.user,
      보호자_전화번호: user.phone,
      피보호자ID: user.patient_id,
      피보호자명: user.patient_name,
      피보호자_성별: user.patient_gender,
      피보호자_생년월일: user.patient_birth,
      피보호자_특이사항: user.patient_note,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "회원목록");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "회원목록.xlsx");
  };

  // 회원삭제(userId들 보냄)
  const WithdrawUser = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("삭제할 회원을 선택해주세요.");
      return;
    }
    try {
      await axiosInstance.delete("/matching/userdelete", {
        data: { ids: selectedRowKeys },
      });
      notification.success({
        message: `선택한 회원 삭제 성공`,
        description: `선택한 회원을 완전히 삭제했습니다.`,
      });
      getUserList(); // 목록 다시 불러오기
      setSelectedRowKeys([]); // 선택 초기화
    } catch (e) {
      console.error("회원 삭제 실패:", e);
      notification.error({
        message: `선택한 회원 삭제 실패`,
        description: `선택한 회원 삭제에 실패했습니다.`,
      });
    }
  };

  // 테이블 rowSelection 설정
  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys);
    },
  };

  const columns = [
    {
      key: "number",
      title: "번호",
      render: (_: any, __: any, index: number) => index + 1,
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
    {
      key: "matching",
      title: "배정일",
      render: (record: any) =>
        record.availableFrom && record.availableTo
          ? `${record.availableFrom} - ${record.availableTo}`
          : `없음`,
    },
  ];

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

  const onSearch: SearchProps["onSearch"] = async (value) => {
    console.log("검색 기준", selectSearch);
    console.log("검색 단어", value);
    try {
      const res = await axiosInstance.get("/matching/searchuser", {
        params: {
          search: selectSearch, // 어떤 기준으로 검색하는지(user_id->보호자ID, user_name->보호자 이름, patient_name->피보호자 이름)
          word: value, // 검색 단어
        },
      });
      const searchData = res.data;
      console.log("검색된 유저들", searchData);

      const mapped = searchData.map((x: any) => ({
        key: x.user_id,
        admin_id: x.admin_id,
        admin_name: x.admin_name,
        id: x.user_id,
        email: x.user_email,
        name: x.user_name,
        phone: x.user_phone,
        patient_id: x.patient_id,
        patient_name: x.patient_name,
        patient_gender: x.patient_gender === "male" ? "남" : "여",
        patient_birth: x.patient_birth || "없음",
        patient_note: x.patient_note || "없음",
        matcing_at: x.matcing_at, // 매칭된 날짜
        created_at: x.user_create,
      }));

      setUsers(mapped);
    } catch (e) {
      console.error("검색 실패: ", e);
      notification.error({
        message: `검색 실패`,
        description: `검색에 실패하였습니다.`,
      });
    }
  };

  return (
    <ConfigProvider theme={GreenTheme}>
      <UserManageStyled className={clsx("usermanage_wrap")}>
        <div className="usermanage_title_box">
          <TitleCompo title="담당 회원" />
          <div>
            <Button className="usermanage_delete_button" onClick={WithdrawUser}>
              회원삭제
            </Button>
            <Button onClick={handleDownloadExcel}>엑셀 다운로드</Button>
          </div>
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
                setSortKey("matcing_at"); // 최신순/오래된순 정렬 기준을 가입일로 변경
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
          rowSelection={rowSelection}
          columns={columns}
          dataSource={sortedUsers}
          rowKey="key"
          onRow={(record) => ({
            onClick: () => {
              setSelectedUser(record); // 클릭한 유저 데이터
              setModalOpen(true); // 모달 열기
            },
          })}
        />
        <Modal
          title="특이사항"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
          centered
        >
          {selectedUser && (
            <div>
              <p>{selectedUser.patient_note}</p>
            </div>
          )}
        </Modal>
      </UserManageStyled>
    </ConfigProvider>
  );
};

export default UserManage;
