import { ReactNode } from "react";
import { useRouter } from "next/router";
import { ContentStyled } from "./styled";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

export interface ContentProps {
  className?: string;
  children: ReactNode;
}

const Content = ({ className, children }: ContentProps) => {
  const router = useRouter();

  return (
    <ContentStyled className={clsx("Content", className)}>
      <main>
        <AnimatePresence>
          <motion.div
            key={router.pathname}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </ContentStyled>
  );
};

export default Content;
