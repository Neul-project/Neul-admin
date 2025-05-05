import { DefaultTheme } from "styled-components";

const theme: DefaultTheme = {
  colors: {
    pointBeige: "#fef6d4", // 포인트 베이지색
    pointGreen: "#5DA487", // 포인트 초록색
    softGreen: "#79b79d", // pointGreen hover시 활용가능한 연한 초록색

    // 사용법 : background-color: ${(props) => props.theme.colors.pointBeige};
    // 색상 연하게 & 진하게 추가해도됨
    // 추가 시 src -> styled.d.ts에도 같은 변수명 추가해야함
  },
};

export default theme;
