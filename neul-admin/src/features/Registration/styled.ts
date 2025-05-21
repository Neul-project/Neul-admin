import styled from "styled-components";

export const RegistrationStyled = styled.div`
  &.registration_wrap {
    padding: 20px;
    .registration_title {
      font-size: 18px;
      font-weight: bolder;
      margin-bottom: 3px;
    }
    .registration_date {
      margin: 25px 0 5px 0;
      font-size: 15px;
      font-weight: 700;
    }
    .registration_button_box {
      display: flex;
      justify-content: flex-end;
      .registration_button {
        margin-top: 30px;
      }
    }
  }
`;
