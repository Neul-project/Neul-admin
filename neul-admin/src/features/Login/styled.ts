import styled from "styled-components";

export const LoginStyled = styled.div`
  &.Login_main_wrap {
    max-width: 400px;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    margin: 0px auto;
    overflow: hidden;
    gap: 15px;

    .Login_main_box {
      width: 400px;
      padding: 20px;
      border: 1px solid rgb(189, 189, 189);
      border-radius: 8px;

      .Login_logo {
        width: 130px;
        margin: 0px auto 23px;

        .Login_imgstyle {
          width: 100%;
          height: 100%;
        }
      }

      .Login_form {
        width: 100%;
        display: flex;
        justify-content: center;
        flex-direction: column;
        text-align: center;

        .Login_input {
          width: 100%;
          padding: 10px 14px;
          border: 1px solid rgb(189, 189, 189);
          border-radius: 8px;
          margin-bottom: 10px;
          font-size: 14px;

          &:focus {
            border: 1px solid #5da487;
            outline: none;
          }
        }
      }
      .Login_btn {
        cursor: pointer;
        width: 100%;
        height: 47px;
        margin-top: 10px;
        border: none;
        border-radius: 8px;
        background-color: rgb(93, 164, 135);
        color: rgb(255, 255, 255);
        font-weight: 700;
        font-size: 16px;
      }
    }
  }
`;
