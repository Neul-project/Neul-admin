export interface HelperInfo {
  id: number;
  gender: string;
  birth: string;
  profileImage: string;
  certificate: string; // 자격증 pdf파일
  desiredPay: number; // 희망 일당
  experience: string; // 경력사항
  certificateName: string;
  certificateName2: string | null;
  certificateName3: string | null;
  status: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string | null;
    created_at: string;
    password: string;
    provider: "local" | string;
    role: "admin" | "user" | string;
  };
}
