import "@toast-ui/editor/dist/toastui-editor.css";
import { Editor } from "@toast-ui/react-editor";
import { useRef } from "react";

const ToastEdit = (props: { setNote: (note: string) => void }) => {
  const { setNote } = props;
  const editorRef = useRef<Editor>(null);

  return (
    <Editor
      ref={editorRef}
      initialEditType="wysiwyg"
      hideModeSwitch={true}
      onChange={() => {
        const markdown = editorRef.current?.getInstance().getMarkdown();
        console.log("mark", markdown);
        setNote(markdown || "");
      }}
    />
  );
};

export default ToastEdit;
