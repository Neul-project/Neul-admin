import styled from "styled-components";

export const MyInfoStyled = styled.div`
  &.myinfo_wrap {
    width: 100%;
    margin: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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

    .myinfo_name_box {
      margin-bottom: 15px;
    }

    .myinfo_flex {
      width: 50%;
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

      .myinfo_title,
      .myinfo_content {
        font-size: 16px;
      }

      .myinfo_pdf {
        display: flex;
        flex-direction: column;
      }
    }

    .myinfo_pw_btn {
      cursor: pointer;
      border-radius: 4px;
      background-color: #f6f6f8;
      border: none;
      padding: 9px 20px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      letter-spacing: -1px;
      color: #747783;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
