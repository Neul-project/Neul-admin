import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useEffect, useRef } from "react";
import { ToastEditStyled } from "./styled";
import clsx from "clsx";
import axiosInstance from "@/lib/axios";

const ToastEdit = (props: {
  setNote: (note: string) => void;
  note: string;
}) => {
  const { setNote, note } = props;
  const editorRef = useRef<Editor>(null);
  console.log("ui note", note);

  //비동기 때문에 실행 순서를 맞추기 위해 설정
  useEffect(() => {
    if (editorRef.current && note) {
      editorRef.current.getInstance().setHTML(note);
    }
  }, [note]);

  return (
    <ToastEditStyled>
      <Editor
        ref={editorRef}
        initialEditType="markdown"
        initialValue={note}
        previewStyle="vertical"
        hideModeSwitch={true}
        onChange={() => {
          const markdown = editorRef.current?.getInstance().getHTML();
          //console.log("mark", markdown);
          setNote(markdown || "");
        }}
        hooks={{
          addImageBlobHook: async (
            blob: Blob,
            callback: (url: string, altText?: string) => void
          ) => {
            const formData = new FormData();
            formData.append("file", blob);

            try {
              const response = await axiosInstance.post(
                "/activity/toastimg",
                formData
              );

              const imageUrl = response.data.url; // 서버 배포 후 확인 가능할거 같음

              callback(imageUrl, "alt text");
            } catch (error) {
              console.error("Image upload error:", error);
            }
          },
        }}
      />
    </ToastEditStyled>
  );
};

export default ToastEdit;
