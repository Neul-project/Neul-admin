import clsx from "clsx";
import { Button, ConfigProvider } from "antd";
import { TitleCompoStyled } from "./styled";

interface TitleProps {
  title: string;
  button?: string;
}

const TitleCompo = ({ title, button }: TitleProps) => {
  return (
    <TitleCompoStyled className={clsx("title-compo")}>
      {title} {button ? <Button>{button}</Button> : <></>}
    </TitleCompoStyled>
  );
};

export default TitleCompo;
