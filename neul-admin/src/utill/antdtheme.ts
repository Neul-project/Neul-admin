import styled from "styled-components";
export const AntdGlobalTheme = {
  token: {
    // global token
  },
  components: {
    // component token
    Input: {
      activeBorderColor: "none",
      activeShadow: "none",
      hoverBorderColor: "none",
    },
    Select: {
      activeBorderColor: "none",
      activeShadow: "none",
      hoverBorderColor: "none",
      activeOutlineColor: "none",
      optionSelectedBg: "#d5E3DB",
    },
    Button: {
      defaultHoverBorderColor: "none",
      defaultHoverColor: "none",
      defaultActiveColor: "none",
      defaultActiveBorderColor: "none",
    },
    Pagination: {
      //itemBg: "#f0f0f0", // 비활성 페이지 배경색
      itemActiveBg: "#fff", // 활성 페이지 배경색
      itemActiveColor: "#ffffff", // 활성 페이지 텍스트 색
      colorText: "#333", // 비활성 텍스트 색
      itemBorder: "#5da487",
    },
    Menu: {
      colorItemBg: "#fff", // 전체 배경색
      colorItemText: "#333", // 일반 텍스트 색
      colorItemBgSelected: "#5da487", // 선택된 항목 배경색
      colorItemTextSelected: "#fff", // 선택된 항목 텍스트 색
      //colorItemBgHover: "#e6f7ff", // hover 시 배경
      //itemSelectedColor: "#5da487",
    },
    Layout: {
      //siderBg: "#f0f2f5", // Sider 배경
    },
  },
};

export const GreenTheme = { token: { colorPrimary: "#5da487" } };

export const paginationstyle = styled.div`
  .ant-pagination-item {
    border-color: #5da487 !important;
    color: #5da487 !important;
  }

  .ant-pagination-item-active {
    border-color: #5da487 !important;
    //box-shadow: 0 0 0 0px #5da487 !important;
    color: #5da487 !important;
  }

  .ant-pagination-item-active a {
    border-color: #5da487 !important;
    //box-shadow: 0 0 0 0px #5da487 !important;
    color: #5da487 !important;
  }

  .ant-select-item-option-selected {
    background-color: #5da487 !important;
    color: #fff !important;
  }
`;
