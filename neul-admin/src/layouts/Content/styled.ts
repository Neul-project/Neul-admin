import styled from "styled-components";

export const ContentStyled = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #f5f5f5;
  padding: 1.5rem 1.5rem;

  .header {
    padding: 1.5rem 3rem;
    font-weight: bold;
    font-size: 1rem;
    display: flex;
    align-items: center;

    i {
      font-size: 1.3rem;
      margin-right: 0.5rem;
      color: white;
    }

    > span {
      margin-bottom: -1px;
      font-weight: normal;
      color: white;

      > span {
        & + span::before {
          content: "/";
          display: inline-block;
          margin: 0 0.3rem;
          font-weight: normal;
        }
      }
    }
  }

  main {
    padding: 1.5rem 1.5rem;
    border-radius: 10px;
    background: white;
    height: 100%;
  }
`;
