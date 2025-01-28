"use client"
import useLocalStorage from "@/lib/use-local-storage";
import React, { createContext, useContext, ReactNode, useState } from "react";
import { useDropzone } from "react-dropzone";
import example from './example.json'

import {
  CloudUploadIcon,
} from "lucide-react"

import { Input } from "@/components/ui/input";
import { cn, fetchApi } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
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
  setOpenCommand: any,
  showEditor: boolean,
  setShowEditor: any
}

const DropzoneContext = createContext<DropzoneContextType | undefined>(undefined);

interface DropzoneProviderProps {
  children: ReactNode;
}

export const DropzoneProvider: React.FC<DropzoneProviderProps> = ({ children }) => {
  const [fileContents, setFileContents] = useLocalStorage<FileContent[]>('files', [{ name: "exemple.json", id: "example", content: example }]);
  const [content, setContent] = useLocalStorage("editor-content", example as any)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [open, setOpenCommand] = React.useState(false)
  const [showEditor, setShowEditor] = useLocalStorage("show-editor", true)
  const [error, setError] = useState<null | string>(null)
  const [url, setUrl] = React.useState("https://coucou.com")

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

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setShowEditor((open) => !open)
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

  const handleFetch = async (e: { preventDefault: () => void; }) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    if (!url.startsWith("https://")) {
      setIsLoading(false)
      return setError("Your endpoint doesn't seem valid.");
    }
    const { data, error } = await fetchApi(url);
    if (error) {
      setIsLoading(false)
      return setError("Error fetching API:" + JSON.stringify(error));
    } else {
      setContent(JSON.stringify(data));
      setOpenCommand(false)
      setIsLoading(false)
    }
  };

  return (
    <DropzoneContext.Provider value={{ fileContents, setFileContents, isDragActive, isLoading, isDragReject, isDragAccept, setContent, content, setOpenCommand, showEditor, setShowEditor }}>
      <div {...getRootProps()} className={"z-[500]"}>
        {children}
        <Dialog open={open} onOpenChange={setOpenCommand}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Import data</DialogTitle>
              <DialogDescription>
                Provide a valid API endpoint or drag and drop your JSON file.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleFetch}>
              <label htmlFor="url" className="flex-grow">
                <Input
                  disabled={isLoading}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  name="url"
                  id="url"
                  className="outline-none border-none focus:outline-none ring-background"
                  placeholder="Type in your API endpoint..."
                />
              </label>
              <input type="submit" style={{ display: "none" }} />
            </form>
            <div>
              <div>
                {isLoading &&
                  <div className="bg-primary/10 text-primary border border-primary/80 px-2 py-1 rounded-md">Fetching data...</div>}
              </div>
              <div>
                {error &&
                  <div className="bg-destructive/10 text-white border border-destructive/80 px-2 py-1 rounded-md">{error}</div>}
              </div>
            </div>
            <div>
              <div className={cn("h-[200px] gap-2 flex items-center justify-center rounded-lg w-full border-2 border-dashed", isDragActive ? "border-primary/50" : "border-foreground/10")}>
                <CloudUploadIcon className="opacity-60" /><span>Drag and drop your file here</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DropzoneContext.Provider>
  );
};

export const useDropzoneContext = (): DropzoneContextType => {
  const context = useContext(DropzoneContext);
  if (!context) {
    throw new Error("useDropzoneContext must be used within a DropzoneProvider");
  }
  return context;
};
