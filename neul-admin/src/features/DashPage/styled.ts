import styled from "styled-components";

export const DashStyled = styled.div`
  .DashPage_top {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;

    .DashPage_today {
      font-size: 15px;
    }
  }

  .DashPage_content {
    display: flex;
    width: 100%;
    margin-top: 30px;
    justify-content: space-between;

    .DashPage_title {
      font-size: 17px;
      font-weight: bolder;
      margin-bottom: 10px;
    }

    .DashPage_age {
      width: 65%;
      height: 50%;
    }

    .DashPage_gender {
      width: 30%;
      height: 50%;
    }
  }

  .DashPage_program_content {
    display: flex;
    width: 65%;
    margin-top: 30px;

    .DashPage_program {
      width: 100%;
      height: 100%;

      .DashPage_title {
        font-size: 17px;
        font-weight: bolder;
        margin-bottom: 10px;
      }
    }
  }
`;
