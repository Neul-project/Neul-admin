import { useEffect, useRef } from "react";
import { FeedbackModalStyled } from "./styled";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const FeedbackModal = (props: { selectedRecord: any }) => {
  const { selectedRecord } = props;

  const isAudioFile =
    typeof selectedRecord.content === "string" &&
    selectedRecord.content.toLowerCase().endsWith(".webm");

  return (
    <FeedbackModalStyled>
      <div className="Feedback_content">
        <div className="Feedback_content_row">
          <strong>내용 :</strong> {selectedRecord.content}
        </div>
        <div className="Feedback_content_row">
          <strong>날짜 :</strong> {selectedRecord.date}
        </div>
        {isAudioFile && (
          <AudioPlayer
            src={
              process.env.NEXT_PUBLIC_API_URL +
              "/uploads/audio/" +
              selectedRecord.content
            }
            showJumpControls={false}
            //onPlay={() => console.log("onPlay")}
          />
        )}
      </div>
    </FeedbackModalStyled>
  );
};

export default FeedbackModal;
