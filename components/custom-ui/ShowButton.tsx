"use client";

import { Button } from "../ui/button";
import CustomCopyBtn from "./CustomCopyBtn";

function ShowButton({ content }: { content: string }) {
  return (
    <Button
      className="w-[70%] group bg-transparent flex items-center justify-start relative"
      variant={"outline"}
    >
      <CustomCopyBtn copyContent={content} />
      {content}
    </Button>
  );
}

export default ShowButton;
