import styled from "styled-components";

export const BannerStyled = styled.div`
  &.Banner_main_wrap {
    .Banner_title {
      font-size: 24px;
      margin-bottom: 15px;
    }

    .Banner_imgs {
      display: flex;
      flex-direction: row;
      width: 100%;
      gap: 20px;

      .Banner_left_img,
      .Banner_right_img {
        width: 50%;
        height: 400px;
        border: 1px solid #ccc;
        border-radius: 15px;
        overflow: hidden;

        .Banner_imgstyle {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .Banner_preview_text {
          display: flex;
          width: 100%;
          height: 100%;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .Banner_btns {
      display: flex;
      justify-content: space-between;
      padding: 0px 150px;
      padding-top: 20px;
    }
    .Banner_save {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 25px;
    }
  }
`;
