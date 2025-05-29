import styled from "styled-components";

export const ActivityStyled = styled.div`
  .activitySubmit_error_message {
    color: red;
    font-size: 12px;
  }
  .activitySubmit_error_title {
    text-align: end;
  }
  .activitySubmit_content {
    margin-bottom: 20px;
  }
  .activitySubmit_imgmax {
    font-size: 12px;
    margin-top: 5px;
    color: rgb(93, 164, 135);
  }
  .activitySubmit_form {
    display: flex;
    flex-direction: column;
    width: 100%;
    //align-items: center;
    gap: 25px;

    .activitySubmit_error_message {
      font-size: 14px;
      margin-top: -15px;
      color: red;
    }

    //파일 업로드 후 hover 시 나오는 눈 이모지 변경
    .ant-upload-list-item-actions .anticon-eye {
      display: none;
    }

    .activitySubmit_text {
      //font-size: 14px;
      margin-bottom: 5px;
    }

    .activitySubmit_toastEdit {
      width: 100%;
    }

    .activitySubmit_ward {
      display: flex;
      width: 100%;
      justify-content: right;
      align-items: center;
      gap: 15px;

      .activitySubmit_text {
        //font-size: 14px;
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
      .ant-upload ant-upload-select {
        display: none !important;
      }
      .activitySubmit_swiper_div {
        display: flex;
        width: 100%;
        height: 300px;
        border-radius: 15px;
        padding: 5px;
        border: 1px solid #ccc;
        margin-top: 15px;
        align-items: center;
        justify-content: center;

        .activitySubmit_swiper_text {
          //font-size: 14px;
        }

        .activitySubmit_swiper {
          width: 100%;
          height: 100%;
          cursor: pointer;

          .swperimg {
            width: 100%;
            height: 100%;
            object-fit: contain;
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

      &.activitySubmit_type_column {
        flex-direction: column;
      }
    }

    .activitySubmit_record_div {
      display: flex;
      flex-direction: column;
      justify-content: center;
      width: 100%;
      margin-top: 50px;
      gap: 5px;

      .activitySubmit_record {
        width: 100%;
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
