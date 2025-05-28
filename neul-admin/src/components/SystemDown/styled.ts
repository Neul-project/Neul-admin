import styled from "styled-components";

export const SystemDownStyled = styled.div`
  &.systemdown_wrap {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 90vh;
    overflow: hidden;

    .systemdown_textbox {
      font-size: 20px;
      text-align: center;
      font-weight: bold;
    }
  }
`;
