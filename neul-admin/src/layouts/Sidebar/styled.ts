import styled from "styled-components";

export const SidebarStyled = styled.div`
  min-width: 200px;
  width: 200px;
  height: calc(100vh - 64px);
  max-height: calc(100vh - 64px);
  overflow-y: auto;
  overflow-x: hidden;
  border-right: 1px solid #eaeaea;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &.SidebarOff {
    display: none;
  }

  .logo {
    margin-bottom: 0rem;
    padding: 1rem 2rem 0 2rem;
    font-family: "Aquatico";
    font-size: 2rem;
    cursor: pointer;
  }

  .menus {
    max-height: 83vh;
    overflow-y: auto;
    .menuGroup {
      padding: 1.5rem 2rem;

      .title {
        font-size: 0.8rem;
        margin-bottom: 0.7rem;
        opacity: 0.6;
      }

      .item {
        display: flex;
        align-items: center;
        /* justify-content: space-between; */
        width: 100%;
        height: 2.8rem;
        border-radius: 6px;
        padding: 0 1rem;
        transition: 300ms background-color;
        position: relative;
        cursor: pointer;

        & + a {
          margin-top: 0.3rem;
        }

        &.active {
          span {
            color: #000;
          }
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .bx,
        span {
          position: relative;
          z-index: 1;
        }

        .bx {
          font-size: 1.4rem;
          margin-right: 0.5rem;
          transition: 200ms color;
        }

        span {
          margin-bottom: -1px;
          white-space: nowrap;
        }

        .counter {
          font-size: 0.85rem;
          margin-left: 0.3rem;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        &.active .counter {
        }

        .menuActiveBG {
          position: absolute;
          /* background-color: rgba(255, 255, 255, 0); */
          width: 100%;
          height: 100%;
          border-radius: 6px;
          left: 0;
          top: 0;
          z-index: 0;
        }
      }
    }
  }

  .bottom {
    padding: 1rem;

    .signOutButton {
      padding: 0.6rem 1.5rem;
      height: auto;
      transition: 0.2s all;
      border-radius: 0.6rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      i {
        font-size: 1.7rem;
        margin-left: 0.5rem;
      }

      &:hover {
        /* box-shadow: 0 0 1.5rem rgba(226, 93, 35, 0.5); */
        background: rgba(255, 255, 255, 0.15);
        color: rgba(255, 255, 255, 0.6);

        /* color: #000; */
      }
    }
  }
`;
