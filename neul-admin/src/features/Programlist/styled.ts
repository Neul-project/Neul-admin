import styled from "styled-components";

export const ProgramlistStyled = styled.div`
  &.Programlist_main_wrap {
    display: flex;
    flex-direction: column;
    gap: 15px;

    .Programlist_execl,
    .Programlist_btns {
      display: flex;
      width: 100%;
      justify-content: end;
    }

    .Programlist_btns {
      gap: 10px;
    }
  }
`;
