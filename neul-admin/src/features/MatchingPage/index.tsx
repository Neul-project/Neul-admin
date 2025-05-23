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
import { GreenTheme } from "@/utill/antdtheme";
import { formatPhoneNumber } from "@/utill/formatter";
import koKR from "antd/locale/ko_KR";
import "dayjs/locale/ko";
dayjs.locale("ko");
import { Calendar } from "antd";
import dayjs, { Dayjs } from "dayjs";

const MatchingPage = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [userOrder, setUserOrder] = useState("DESC");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortedUsers, setSortedUsers] = useState<any[]>([]);
  const adminId = useAuthStore((state) => state.user?.id);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refuseReason, setRefuseReason] = useState("");

  // 해당 도우미에게 신청한 user 불러오기
  const getApplyList = async () => {
    try {
      const res = await axiosInstance.get("/matching/applyuser");
      const data = res.data;
      console.log("신청한 user정보", data);

      const mapped = data.map((x: any, i: number) => ({
        key: i,
        applyId: x.apply_id,
        status: x.status, //수락 여부
        id: x.id,
        email: x.email,
        name: x.name,
        phone: x.phone,
        patient_id: x.patient_id,
        patient_name: x.patient_name,
        patient_gender: x.patient_gender === "male" ? "남" : "여",
        patient_birth: x.patient_birth || "없음",
        patient_note: x.patient_note || "없음",
        created_at: x.created_at,
        dates: x.dates, // 사용자가 신청한 날짜
      }));
      setUsers(
        mapped.filter(
          (item: { status: string }) =>
            item.status !== "승인 반려" && item.status !== "결제 완료"
        )
      );
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
      신청날짜: user.dates,
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
        data.status === "승인 대기" ? (
          // 신청만 왔을 경우
          <>
            <Button
              className="matching_accept_button"
              onClick={(e) => {
                e.stopPropagation();

                Modal.confirm({
                  title: "해당 유저와 매칭하시겠습니까?",
                  content: "해당 유저의 담당 도우미가 됩니다.",
                  cancelText: "아니요",
                  okText: "예",
                  okButtonProps: {
                    style: { backgroundColor: "#5DA487" },
                  },
                  cancelButtonProps: {
                    style: { color: "#5DA487" },
                  },
                  async onOk() {
                    console.log("AAAAAAAa", data);
                    try {
                      // 수락
                      await axiosInstance.post(`/matching/accept`, {
                        applyId: data.applyId, // 신청(apply) id
                        adminId, // 도우미 id
                        userId: data.id, // 보호자 id
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
        ) : data.status === "결제 대기" ? (
          // 결제 대기(수락은 한 상태)
          <>결제 대기중</>
        ) : (
          <></>
        ),
    },
  ];

  const sortOption = [
    { value: "DESC", label: "최신순" },
    { value: "ASC", label: "오래된순" },
  ];

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
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          footer={null}
          centered
        >
          {selectedUser && (
            <div>
              <h4>특이사항</h4>
              <p>{selectedUser.patient_note}</p>

              <h4 style={{ marginTop: 20 }}>신청 날짜</h4>
              <ConfigProvider locale={koKR}>
                <Calendar
                  fullscreen={false}
                  value={
                    selectedUser?.dates
                      ? dayjs(
                          selectedUser.dates
                            .split(",")
                            .map((d: string) => dayjs(d.trim()))
                            .sort(
                              (
                                a: { unix: () => number },
                                b: { unix: () => number }
                              ) => a.unix() - b.unix()
                            )[0] // 가장 빠른 날짜
                        )
                      : undefined
                  }
                  cellRender={(value: Dayjs) => {
                    const dateString = selectedUser.dates || ""; // 문자열
                    const selectedDates = dateString
                      .split(",")
                      .map((d: string) => dayjs(d.trim()).format("YYYY-MM-DD")); // 문자열 -> 배열

                    const current = value.format("YYYY-MM-DD");

                    if (selectedDates.includes(current)) {
                      return (
                        <div
                          style={{
                            color: "#5DA487",
                            textAlign: "center",
                          }}
                        >
                          신청
                        </div>
                      );
                    }

                    return null;
                  }}
                />
              </ConfigProvider>
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
              await axiosInstance.post(`/matching/cancel`, {
                applyId: selectedUser.applyId, // 신청(apply) id
                adminId, // 도우미 id
                userId: selectedUser.id, // 보호자 id
                content: refuseReason, // 거절 사유
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
