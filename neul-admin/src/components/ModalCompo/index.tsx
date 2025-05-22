import { ReactNode } from "react";
import { ModalStyled } from "./styled";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const ModalCompo = ({ onClose, children }: ModalProps) => {
  return (
    <ModalStyled>
      <div className="Modal_close" onClick={onClose}>
        <i className="fa-solid fa-xmark "></i>
      </div>

      <div className="Modal_container">{children}</div>
    </ModalStyled>
  );
};

export default ModalCompo;
