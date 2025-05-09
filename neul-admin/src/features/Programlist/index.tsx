import { useRouter } from "next/router";
import { ProgramlistStyled } from "./styled";

//프로그램 리스트 컴포넌트
const Programlist = () => {
  const router = useRouter();

  const ProgramPost = () => {
    router.push("/program/manage/write");
  };

  return (
    <ProgramlistStyled>
      <div>프로그램 등록 페이지</div>
      <div>
        <button onClick={ProgramPost}>등록하기</button>
        <button>삭제하기</button>
      </div>
      <div>테이블 영역</div>
    </ProgramlistStyled>
  );
};

export default Programlist;
