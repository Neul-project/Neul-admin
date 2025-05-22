import { FeedbackModalStyled } from "./styled";
const FeedbackModal = (props: { selectedRecord: any }) => {
  const { selectedRecord } = props;
  //console.log("selectedRecord", selectedRecord);

  return (
    <FeedbackModalStyled>
      <div className="Feedback_content">
        <div className="Feedback_content_row">
          <strong className="Feedback_content_title">활동기록</strong>
          {selectedRecord.origin.activity.title}
        </div>
        <div className="Feedback_content_row">
          <strong className="Feedback_content_title">내용 </strong>
          <div className="Feedback_content_content">
            {selectedRecord.content}
          </div>
        </div>
        <div className="Feedback_content_row">
          <strong className="Feedback_content_title">날짜 </strong>
          {selectedRecord.date}
        </div>
      </div>
    </FeedbackModalStyled>
  );
};

export default FeedbackModal;
