import styled from "styled-components";

export const ModalStyled = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;

  .Modal_container {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    line-height: 48px;
    background-color: #f9f9f9;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 90vh;
    overflow-y: auto;
  }

  .Modal_close {
    position: absolute;
    z-index: 1;
    top: 18px;
    right: 20px;
    /* width: 32px;
    height: 32px;
    background-color: #f9f9f9; */
    /* border: 1px solid #ccc; */
    border-radius: 50%;
    font-size: 28px;
    line-height: 28px;
    text-align: center;
    cursor: pointer;
    color: #fff;
    font-weight: bold;

    /* &:hover {
      background-color: #f0f0f0;
    } */
  }
`;
