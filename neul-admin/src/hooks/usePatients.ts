import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";

interface PatientType {
  patient_id: number;
  name: string;
}

// 로그인한 관리자의 담당 피보호자 불러오기
export const usePatients = (adminId?: number) => {
  const [patients, setPatients] = useState<PatientType[]>([]);

  useEffect(() => {
    if (!adminId) return;
    const fetch = async () => {
      const res = await axiosInstance.get("/status/patient", {
        params: { adminId },
      });
      setPatients(
        res.data.map((item: any) => ({
          patient_id: item.id,
          name: item.name,
        }))
      );
    };
    fetch();
  }, [adminId]);

  return patients;
};
