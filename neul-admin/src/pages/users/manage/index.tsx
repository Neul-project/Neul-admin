import { useEffect, useState } from "react";
import { Button, message, Table } from "antd";
import clsx from "clsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRouter } from "next/router";
import TitleCompo from "@/components/TitleCompo";
import axiosInstance from "@/lib/axios";
import { UserManageStyled } from "./styled";

const dummyData = [
  {
    key: 1,
    id: 1,
    email: "testuser1@example.com",
    name: "홍길동",
    phone: "010-1234-5678",
    patient_id: "1",
    patient_name: "김철수",
    patient_gender: "남성",
    patient_birth: "1985-06-15",
    patient_note: "특이사항 없음",
  },
  {
    key: 2,
    id: 2,
    email: "testname2@example.com",
    name: "김영희",
    phone: "010-2345-6789",
    patient_id: "2",
    patient_name: "박영수",
    patient_gender: "여성",
    patient_birth: "1992-03-22",
    patient_note: "알러지 있음",
  },
  {
    key: 3,
    id: 3,
    email: "testname3@example.com",
    name: "이민수",
    phone: "010-3456-7890",
    patient_id: "3",
    patient_name: "최정희",
    patient_gender: "여성",
    patient_birth: "2000-12-30",
    patient_note: "발열 증상 있음",
  },
  {
    key: 4,
    id: 4,
    email: "testname4@example.com",
    name: "박준호",
    phone: "010-4567-8901",
    patient_id: "4",
    patient_name: "정지훈",
    patient_gender: "남성",
    patient_birth: "1978-11-05",
    patient_note: "고혈압",
  },
  {
    key: 5,
    id: 5,
    email: "testname5@example.com",
    name: "정은지",
    phone: "010-5678-9012",
    patient_id: "5",
    patient_name: "오성현",
    patient_gender: "남성",
    patient_birth: "1995-07-14",
    patient_note: "운동 부족",
  },
];

const UserManage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const router = useRouter();

  const getUserList = async () => {
    try {
      // 모든 user불러오기(유저 id, email, name, phone, 피보호자id, 피보호자이름,성별, 피보호자 생년월일, 특이사항 보내주기)
      const res = await axiosInstance.get("/user/alluser");
      const data = res.data;

      const mapped = data.map((x: any) => ({
        key: x.id,
        id: x.id,
        email: x.email,
        name: x.name,
        phone: x.phone,
        patient_id: x.patient_id,
        patient_name: x.patient_name,
        patient_gender: x.patient_gender || "없음",
        patient_birth: x.patient_birth || "없음",
        patient_note: x.patient_note || "없음",
      }));

      setUsers(mapped);
      // setUsers(dummyData);
    } catch (err) {
      console.error("유저 불러오기 실패", err);
    }
  };

  useEffect(() => {
    getUserList();
  }, []);

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

  const WithdrawUser = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning("삭제할 회원을 선택해주세요.");
      return;
    }

    try {
      // 선택한 회원 삭제(탈퇴)
      await axiosInstance.delete("/user/delete", {
        data: { userIds: selectedRowKeys },
      });
      message.success("선택한 회원을 완전히 삭제했습니다.");
      getUserList();
      setSelectedRowKeys([]);
    } catch (err) {
      console.error("회원 삭제 실패:", err);
      message.error("회원 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

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
    {
      key: "patient_note",
      title: "메모",
      dataIndex: "patient_note",
    },
    {
      key: "matching",
      title: "매칭",
      render: (data: any) => (
        <Button onClick={() => router.push(`/memberedit/${data.key}`)}>
          매칭
        </Button>
      ),
    },
  ];

  return (
    <UserManageStyled className={clsx("usermanage_wrap")}>
      <div className="usermanage_title_box">
        <TitleCompo title="회원 관리" />
        <div>
          <Button onClick={() => router.push("/memberadd")}>회원추가</Button>
          <Button className="usermanage_delete_button" onClick={WithdrawUser}>
            회원삭제
          </Button>
        </div>
      </div>

      <div className="usermanage_info">
        <div className="usermanage_total_num">총 {users.length}명</div>
        <Button onClick={handleDownloadExcel}>엑셀</Button>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={users}
        rowKey="key"
      />
    </UserManageStyled>
  );
};

export default UserManage;
