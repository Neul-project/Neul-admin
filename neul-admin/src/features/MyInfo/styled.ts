import styled from "styled-components";

export const MyInfoStyled = styled.div`
  &.myinfo_wrap {
    width: 100%;
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .myinfo_profile_wrap {
      margin-bottom: 24px;
      padding: 10px 150px 50px 150px;
      border-bottom: 1px solid #eee;
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .myinfo_top_box {
      width: 350px;
    }

    .myinfo_img_box {
      width: 150px;
      height: 150px;
      .myinfo_img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    .myinfo_input {
      width: 80%;
      height: 32px;
      margin-bottom: 10px;
      border: none;
      background-color: white;
      //background-color: #f6f6f8;
      font-size: 16px;
    }
    .myinfo_input:focus {
      border: none;
      background-color: #f6f6f8;
      outline: none;
    }

    .myinfo_name_box {
      margin-bottom: 15px;
    }

    .myinfo_bottom_box {
      width: 80%;
      padding: 10px 50px 50px 50px;
    }

    .myinfo_flexs {
      display: flex;
      justify-content: space-between;

      .myinfo_email {
        font-size: 14px;
        color: #848896;
      }
      .myinfo_name {
        font-size: 19px;
        line-height: 29px;
        letter-spacing: -0.63px;
        color: #1c1c1c;
        word-break: break-all;
      }
    }

    .myinfo_title,
    .myinfo_content {
      font-size: 18px;
      //width: fit-content;
    }

    .myinfo_title {
      width: 180px;
    }

    .myinfo_flex {
      display: flex;
      flex-direction: row;
    }

    .myinfo_flex_pdf {
      display: flex;
      flex-direction: row;
      //justify-content: space-between;
      align-items: end;

      .myinfo_pdf {
        display: flex;
        //justify-content: space-between;
        //flex-direction: column;

        .myinfo_origin_pdf {
          width: 260px;

          &:hover {
            color: ${(props) => props.theme.colors.pointGreen};
          }
        }
      }
    }

    .error {
      height: fit-content;
      color: red;
    }

    .myinfo_pw_btn {
      cursor: pointer;
      border-radius: 4px;
      background-color: #f6f6f8;
      border: none;
      padding: 9px 22px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      letter-spacing: -1px;
      color: #747783;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .myinfo_button_box {
      display: flex;
      justify-content: flex-end;
      margin-top: 60px;
      gap: 10px;
    }
  }
`;
