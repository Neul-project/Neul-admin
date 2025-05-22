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
      margin-bottom: 50px;
      .myinfo_img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    .myinfo_flex {
      width: 50%;
      display: flex;
      justify-content: space-between;
      .myinfo_email {
        font-size: 14px;
        color: #848896;
      }
    }

    .myinfo_pw_btn {
      cursor: pointer;
      border-radius: 4px;
      background-color: #f6f6f8;
      border: none;
      padding: 9px 12px;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      letter-spacing: -1px;
      color: #747783;
      text-align: center;
    }
  }
`;
