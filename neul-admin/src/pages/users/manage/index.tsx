import { useEffect, useState } from "react";
import { Button, message, Select, Table } from "antd";
import clsx from "clsx";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { useRouter } from "next/router";
import TitleCompo from "@/components/TitleCompo";
import axiosInstance from "@/lib/axios";
import { UserManageStyled } from "./styled";

const UserManage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [userOrder, setUserOrder] = useState("DESC");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortedUsers, setSortedUsers] = useState<any[]>([]);
  const router = useRouter();

  const getUserList = async () => {
    try {
      // 모든 user불러오기(담당 adminId, 관리자 이름, 유저 id, email, name, phone, 피보호자id, 피보호자이름,성별, 피보호자 생년월일, 특이사항 보내주기)
      const res = await axiosInstance.get("/matching/alluser");
      const data = res.data;
      console.log(data);

      const mapped = data.map((x: any) => ({
        key: x.user_id,
        admin_id: x.admin_id,
        admin_name: x.admin_name,
        id: x.user_id,
        email: x.user_email,
        name: x.user_name,
        phone: x.user_phone,
        patient_id: x.patient_id,
        patient_name: x.patient_name,
        patient_gender: x.patient_gender || "없음",
        patient_birth: x.patient_birth || "없음",
        patient_note: x.patient_note || "없음",
        created_at: x.user_create,
      }));

      setUsers(mapped);
    } catch (err) {
      console.error("유저 불러오기 실패", err);
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
    console.log(selectedRowKeys);
    try {
      await axiosInstance.delete("/matching/userdelete", {
        data: { userIds: selectedRowKeys },
      });

      message.success("선택한 회원을 완전히 삭제했습니다.");
      getUserList(); // 목록 다시 불러오기
      setSelectedRowKeys([]); // 선택 초기화
    } catch (err) {
      console.error("회원 삭제 실패:", err);
      message.error("회원 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.");
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

  const option1 = [
    { value: "DESC", label: "최신순" },
    { value: "ASC", label: "오래된순" },
  ];

  return (
    <UserManageStyled className={clsx("usermanage_wrap")}>
      <div className="usermanage_title_box">
        <TitleCompo title="회원 관리" />
      </div>
      <div className="manage-select-box">
        <Select
          value={userOrder}
          options={option1}
          onChange={(e) => {
            setUserOrder(e);
            setSortKey("created_at"); // 최신순/오래된순 정렬 기준을 가입일로 변경
          }}
        />
      </div>
      <div className="usermanage_info">
        <div className="usermanage_total_num">총 {users.length}명</div>
        <div>
          <Button className="usermanage_delete_button" onClick={WithdrawUser}>
            회원삭제
          </Button>
          <Button onClick={handleDownloadExcel}>엑셀 다운</Button>
        </div>
      </div>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={sortedUsers}
        rowKey="key"
      />
    </UserManageStyled>
  );
};

export default UserManage;
