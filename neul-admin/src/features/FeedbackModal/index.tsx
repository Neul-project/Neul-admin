import { FeedbackModalStyled } from "./styled";
const FeedbackModal = (props: { selectedRecord: any }) => {
  const { selectedRecord } = props;
  //console.log("selectedRecord", selectedRecord);

  return (
    <FeedbackModalStyled>
      <div className="Feedback_content">
        <div className="Feedback_content_row">
          <strong>활동기록 이름 : </strong>
          {selectedRecord.origin.activity.title}
        </div>
        <div className="Feedback_content_row">
          <strong>내용 :</strong> {selectedRecord.content}
        </div>
        <div className="Feedback_content_row">
          <strong>날짜 :</strong> {selectedRecord.date}
        </div>
      </div>
    </FeedbackModalStyled>
  );
};

export default FeedbackModal;
