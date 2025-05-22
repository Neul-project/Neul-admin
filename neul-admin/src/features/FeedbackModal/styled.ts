import styled from "styled-components";

export const FeedbackModalStyled = styled.div`
  .Feedback_content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 70vh;
    //min-height: 300px;
    overflow-y: auto;
    margin-top: 24px;
    padding-right: 10px;
  }

  .Feedback_content_row {
    //margin-bottom: 10px;
    font-size: 15px;
    display: flex;

    .Feedback_content_title {
      //background-color: red;
      width: 100px;
    }

    .Feedback_content_content {
      width: 100%;
      max-height: 350px;
      overflow-y: auto;
      padding-left: 15px;
    }
  }

  .rhap_container {
    box-shadow: none;
  }
`;
