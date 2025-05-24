import styled from "styled-components";
export const ChoiceWorkdayStyled = styled.div`
  .ChoiceWorkday_submit {
    display: flex;
    justify-content: start;
    margin-bottom: 20px;
  }

  .ChoiceWorkday_main {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .ChoiceWorkday_days,
    .ChoiceWorkday_we {
      display: flex;
    }

    .ChoiceWorkday_title {
      width: 150px;
    }
  }

  .ChoiceWorkday_content {
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 15px;
  }
`;
