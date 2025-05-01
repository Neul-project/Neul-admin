import styled from "styled-components";

export const ActivityStyled = styled.div`
  .activitySubmit_form {
    display: flex;
    flex-direction: column;
    width: 100%;
    //align-items: center;
    gap: 25px;

    .activitySubmit_text {
      font-size: 14px;
      margin-bottom: 5px;
    }

    .activitySubmit_ward {
      display: flex;
      width: 100%;
      justify-content: right;
      align-items: center;
      gap: 15px;

      .activitySubmit_text {
        font-size: 14px;
        //margin-right: 5px;
      }

      .activitySubmit_select {
        width: 200px;
      }
    }

    .activitySubmit_title {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .activitySubmit_title_input {
        width: 95%;
      }
    }

    .activitySubmit_image {
      .activitySubmit_swiper_div {
        display: flex;
        width: 100%;
        height: 300px;
        border-radius: 15px;
        padding: 10px;
        border: 1px solid #ccc;
        margin-top: 15px;
        align-items: center;
        justify-content: center;

        .activitySubmit_swiper_text {
          font-size: 14px;
        }

        .activitySubmit_swiper {
          width: 100%;
          height: 100%;
          cursor: pointer;

          .swperimg {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }

    .activitySubmit_type {
      display: flex;
      gap: 20px;
      width: 100%;

      .activitySubmit_select {
        width: 250px;
      }
      .activitySubmit_radio {
        width: 120px;
        text-align: center;
      }
    }

    .activitySubmit_record_div {
      display: flex;
      justify-content: center;
      width: 100%;
      margin-top: 50px;

      .activitySubmit_record {
        width: 120px;
      }
    }
  }
`;

export const ActivityTheme = {
  token: {
    // global token
  },
  components: {
    // component token
    Input: {
      activeBorderColor: "none",
      activeShadow: "none",
      hoverBorderColor: "none",
    },
    Select: {
      activeBorderColor: "none",
      activeShadow: "none",
      hoverBorderColor: "none",
      activeOutlineColor: "none",
    },
    Button: {
      defaultHoverBorderColor: "none",
      defaultHoverColor: "none",
      defaultActiveColor: "none",
      defaultActiveBorderColor: "none",
    },
    Radio: {
      buttonSolidCheckedHoverBg: "#5da487",
    },
  },
};
