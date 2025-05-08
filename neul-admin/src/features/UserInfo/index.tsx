import { useRouter } from "next/router";
import { UserInfoStyled } from "./styled";
import Cookies from "js-cookie";

//개인정보 컴포넌트
const UesrInfo = () => {
  const router = useRouter();

  const logout = () => {
    Cookies.remove("access_token");

    router.push("/login");
  };

  return (
    <UserInfoStyled>
      <div onClick={logout}>로그아웃</div>
    </UserInfoStyled>
  );
};

export default UesrInfo;
