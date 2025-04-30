import { ReactNode } from "react";

import Content from "../Content";
import Sidebar from "../Sidebar";
import { TemplateStyled } from "./styled";

import clsx from "clsx";

export interface TemplateProps {
  className?: string;
  children: ReactNode;
}

const Template = ({ className, children }: TemplateProps) => {
  return (
    <TemplateStyled className={clsx("Template", className)}>
      <Sidebar />
      <Content>{children}</Content>
    </TemplateStyled>
  );
};

export default Template;
