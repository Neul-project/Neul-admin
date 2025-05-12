import styled from "styled-components";

export const HelperManageStyled = styled.div`
  &.helpermanage_wrap {
    padding: 24px;
    .helpermanage_title_box {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
    }
    .helpermanage_info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
      .helpermanage_sort_box {
        display: flex;
        align-items: center;
        .helpermanage_total_num {
          font-weight: 600;
          margin-right: 10px;
        }
      }
    }
    tr:hover {
      cursor: pointer;
    }
  }
`;
