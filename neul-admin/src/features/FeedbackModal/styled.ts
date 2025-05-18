import styled from "styled-components";

export const FeedbackModalStyled = styled.div`
  .ant-modal-content {
    padding: 20px 10px 20px 20px;
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
    }
  }

  .rhap_container {
    box-shadow: none;
  }
`;
