import clsx from "clsx";
import { MatchingPageStyled } from "./styled";
import TitleCompo from "@/components/TitleCompo";
import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Select,
  Table,
  Input,
  notification,
  ConfigProvider,
} from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axiosInstance from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import type { SearchProps } from "antd/es/input";
import { GreenTheme } from "@/utill/antdtheme";
import { formatPhoneNumber } from "@/utill/formatter";
const { Search } = Input;

const dummyUsers = [
  {
    key: "user001",
    status: "apply", // 수락 대기
    id: "user001",
    email: "guardian001@example.com",
    name: "김보호자",
    phone: "01012345678",
    patient_id: "patient001",
    patient_name: "이환자",
    patient_gender: "남",
    patient_birth: "1950-05-20",
    patient_note: "치매 초기 증상 있음",
    created_at: "2025-05-01T10:00:00Z",
  },
  {
    key: "user002",
    status: "accepted", // 수락 완료, 결제 대기중
    id: "user002",
    email: "guardian002@example.com",
    name: "박보호자",
    phone: "01023456789",
    patient_id: "patient002",
    patient_name: "김환자",
    patient_gender: "여",
    patient_birth: "1945-08-15",
    patient_note: "거동이 불편함",
    created_at: "2025-05-02T14:30:00Z",
  },
  {
    key: "user003",
    status: "apply",
    id: "user003",
    email: "guardian003@example.com",
    name: "최보호자",
    phone: "01098765432",
    patient_id: "patient003",
    patient_name: "최환자",
    patient_gender: "남",
    patient_birth: "1952-12-05",
    patient_note: "고혈압, 당뇨",
    created_at: "2025-05-03T09:20:00Z",
  },
];

const MatchingPage = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userOrder, setUserOrder] = useState("DESC");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortedUsers, setSortedUsers] = useState<any[]>([]);
  const [selectSearch, setSelectSearch] = useState<string>("user_id");
  const adminId = useAuthStore((state) => state.user?.id);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refuseReason, setRefuseReason] = useState("");

  // 해당 도우미에게 신청한 user 불러오기
  const getApplyList = async () => {
    try {
      // setUsers(dummyUsers);
      const res = await axiosInstance.get("/matching/applyuser");
      const data = res.data;
      console.log("신청한 user정보", data);

      const mapped = data.map((x: any) => ({
        key: x.user_id,
        status: x.status, //수락 여부
        id: x.user_id,
        email: x.user_email,
        name: x.user_name,
        phone: x.user_phone,
        patient_id: x.patient_id,
        patient_name: x.patient_name,
        patient_gender: x.patient_gender === "male" ? "남" : "여",
        patient_birth: x.patient_birth || "없음",
        patient_note: x.patient_note || "없음",
        created_at: x.user_create,
      }));

      setUsers(mapped);
    } catch (err) {
      console.error("신청 정보 불러오기 실패", err);
    }
  };

  useEffect(() => {
    getApplyList();
  }, []);

  // 유저 정렬하기
  const sortUsers = () => {
    let sorted = [...users];

    if (sortKey === "created_at") {
      sorted.sort((a, b) =>
        userOrder === "DESC"
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
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
      보호자명: user.name,
      보호자_전화번호: user.phone,
      피보호자ID: user.patient_id,
      피보호자명: user.patient_name,
      피보호자_성별: user.patient_gender,
      피보호자_생년월일: user.patient_birth,
      피보호자_특이사항: user.patient_note,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "신청목록");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "신청목록.xlsx");
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
      title: "관리",
      render: (data: any) =>
        data.status === "apply" ? (
          // 신청만 왔을 경우
          <>
            <Button
              className="matching_accept_button"
              onClick={(e) => {
                e.stopPropagation();

                Modal.confirm({
                  title: "해당 유저와 매칭하시겠습니까?",
                  content: "해당 유저의 담당 관리자가 됩니다.",
                  cancelText: "아니요",
                  okText: "예",
                  okButtonProps: {
                    style: { backgroundColor: "#5DA487" },
                  },
                  cancelButtonProps: {
                    style: { color: "#5DA487" },
                  },
                  async onOk() {
                    try {
                      // 수락
                      await axiosInstance.post(`/matching/accept`, {
                        adminId,
                        userId: data.id,
                      });
                      notification.success({
                        message: `매칭 성공`,
                        description: `해당 유저와 매칭되었습니다.`,
                      });
                      getApplyList();
                    } catch (e) {
                      console.error("해당 유저와의 매칭 실패: ", e);
                      notification.error({
                        message: `매칭 실패`,
                        description: `해당 유저와의 매칭에 실패했습니다.`,
                      });
                    }
                  },
                });
              }}
            >
              수락
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(data); // 어떤 유저인지 저장
                setIsModalVisible(true); // 모달 열기
              }}
            >
              거절
            </Button>
          </>
        ) : (
          // 결제 대기(수락은 한 상태)
          <>결제 대기중</>
        ),
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
      // 신청된 목록 중에서 검색
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
        id: x.user_id,
        email: x.user_email,
        name: x.user_name,
        phone: x.user_phone,
        patient_id: x.patient_id,
        patient_name: x.patient_name,
        patient_gender: x.patient_gender === "male" ? "남" : "여",
        patient_birth: x.patient_birth || "없음",
        patient_note: x.patient_note || "없음",
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
      <MatchingPageStyled className={clsx("matching_wrap")}>
        <div className="usermanage_title_box">
          <TitleCompo title="매칭 관리" />
          <div>
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
                setSortKey("created_at"); // 최신순/오래된순 정렬 기준을 가입일로 변경
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
          rowKey="key"
          onRow={(record) => ({
            onClick: (e) => {
              e.stopPropagation();
              setSelectedUser(record); // 클릭한 유저 데이터
              setModalOpen(true); // 모달 열기
            },
          })}
        />

        {/* 특이사항 모달 */}
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

        {/* 거절 모달 */}
        <Modal
          open={isModalVisible}
          title="해당 신청을 거절하시겠습니까?"
          onCancel={() => {
            setIsModalVisible(false);
            setRefuseReason("");
          }}
          onOk={async () => {
            if (!refuseReason.trim()) {
              notification.warning({
                message: "거절 사유를 입력해주세요.",
              });
              return;
            }

            try {
              await axiosInstance.post(`/matching/refuse`, {
                adminId,
                userId: selectedUser.id,
                content: refuseReason,
              });

              notification.success({
                message: `신청 거절`,
                description: `해당 신청을 거절했습니다.`,
              });

              getApplyList(); // 새로고침
            } catch (e) {
              console.error("신청 거절 실패: ", e);
              notification.error({
                message: `신청 거절 실패`,
                description: `신청 거절에 실패했습니다.`,
              });
            }

            setIsModalVisible(false);
            setRefuseReason("");
          }}
          okText="거절"
          cancelText="취소"
          okButtonProps={{
            style: { backgroundColor: "#5DA487" },
          }}
          cancelButtonProps={{
            style: { color: "#5DA487" },
          }}
        >
          <div style={{ marginBottom: 8 }}>거절 사유</div>
          <Input.TextArea
            value={refuseReason}
            onChange={(e) => setRefuseReason(e.target.value)}
            placeholder="거절 사유를 입력해주세요"
            rows={4}
            style={{ height: "100px", resize: "none" }}
          />
        </Modal>
      </MatchingPageStyled>
    </ConfigProvider>
  );
};

export default MatchingPage;
