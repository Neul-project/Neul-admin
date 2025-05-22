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

    .myinfo_info {
      padding: 0 250px;
      width: 100%;
      display: flex;
      gap: 50px;
      .myinfo_column {
        display: flex;
        flex-direction: column;
        gap: 12px;
        font-size: 18px;
        .myinfo_title {
          font-weight: bold;
          color: #ccc;
        }
        .myinfo_content {
          color: #333;
        }
      }
    }
  }
`;
