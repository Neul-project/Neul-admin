import styled from "styled-components";

export const ProgramWriteStyled = styled.div`
  &.ProgramWrite_main_wrap {
    width: 100%;

    .ProgramWrite_submit {
      width: 100%;
      display: flex;
      justify-content: end;
    }

    .ProgramWrite_form_content {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .ProgramWrite_row {
        /* display: flex;
        flex-direction: column; */
        align-items: center;
        gap: 10px;
      }
    }
  }
`;
