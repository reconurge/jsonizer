"use client"
import useLocalStorage from "@/lib/use-local-storage";
import React, { createContext, useContext, ReactNode, useState } from "react";
import { useDropzone } from "react-dropzone";
import example from './example.json'

import {
  Calendar,
  CloudUploadIcon,
} from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { cn } from "@/lib/utils";
type FileContent = { name: string; content: any, id: string };

interface DropzoneContextType {
  fileContents: FileContent[];
  content: any,
  setContent: any,
  setFileContents: any,
  isDragActive: boolean;
  isLoading: boolean,
  isDragReject: boolean,
  isDragAccept: boolean,
  setOpenCommand: any
}

const DropzoneContext = createContext<DropzoneContextType | undefined>(undefined);

interface DropzoneProviderProps {
  children: ReactNode;
}

export const DropzoneProvider: React.FC<DropzoneProviderProps> = ({ children }) => {
  const [fileContents, setFileContents] = useLocalStorage<FileContent[]>('files', [{ name: "exemple.json", id: "example", content: example }]);
  const [content, setContent] = useLocalStorage("editor-content", JSON.stringify({ example }))
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [open, setOpenCommand] = React.useState(false)

  const onDrop = async (acceptedFiles: File[]) => {
    setIsLoading(true)
    const jsonContents = await Promise.all(
      acceptedFiles.map((file) =>
        file.text().then((content) => (content))
      )
    );
    setContent(jsonContents[0])
    setIsLoading(false)
    setOpenCommand(false)
  };

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpenCommand((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const { getRootProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
    accept: { "application/json": [".json"] },
    noClick: true,
    onDrop,
  });

  return (
    <DropzoneContext.Provider value={{ fileContents, setFileContents, isDragActive, isLoading, isDragReject, isDragAccept, setContent, content, setOpenCommand }}>
      <div {...getRootProps()} className={"z-[500]"}>
        {children}
        <CommandDialog open={open} onOpenChange={setOpenCommand}>
          <CommandInput placeholder="Type in your api endpoint..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="From an endpoint">
              <CommandItem defaultChecked>
                <Calendar />
                <span>Api endpoint</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
          <div className="p-6">
            <div className={cn("h-[200px] gap-2 flex items-center justify-center rounded-lg w-full border-2 border-dashed", isDragActive ? "border-primary/50" : "border-foreground/10")}>
              <CloudUploadIcon className="opacity-60" /><span>Drag and drop your file here</span>
            </div>
          </div>
        </CommandDialog>
      </div>
    </DropzoneContext.Provider >
  );
};

export const useDropzoneContext = (): DropzoneContextType => {
  const context = useContext(DropzoneContext);
  if (!context) {
    throw new Error("useDropzoneContext must be used within a DropzoneProvider");
  }
  return context;
};
