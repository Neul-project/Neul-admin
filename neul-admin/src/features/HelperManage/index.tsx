import { HelperManageStyled } from "./styled";
import { useEffect, useState } from "react";
import { Button, Modal, Select, Table } from "antd";
import clsx from "clsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import TitleCompo from "@/components/TitleCompo";
import axiosInstance from "@/lib/axios";

const HelperManage = () => {
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [userOrder, setUserOrder] = useState("DESC");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortedUsers, setSortedUsers] = useState<any[]>([]);

  const getUserList = async () => {
    try {
      // 담당 user불러오기
      const res = await axiosInstance.get("/matching/matchuser");
      const data = res.data;
      console.log(data);

      // 보호자 id, 보호자 이메일, 보호자 이름, 보호자 전화번호, 피보호자 id, 피보호자 이름, 피보호자 성별, 피보호자 생일, 피보호자 특이사항, 가입 날짜 보내주기
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
      dataIndex: "phone",
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
  ];

  const sortOption = [
    { value: "DESC", label: "최신순" },
    { value: "ASC", label: "오래된순" },
  ];

  return (
    <HelperManageStyled className={clsx("helpermanage_wrap")}>
      <div className="helpermanage_title_box">
        <TitleCompo title="담당 회원" />
        <Button onClick={handleDownloadExcel}>엑셀 다운</Button>
      </div>

      <div className="helpermanage_info">
        <div className="helpermanage_sort_box">
          <div className="helpermanage_total_num">총 {users.length}명</div>
          <Select
            className="helpermanage_order"
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
    </HelperManageStyled>
  );
};

export default HelperManage;
