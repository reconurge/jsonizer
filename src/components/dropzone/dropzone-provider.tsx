"use client"
import useLocalStorage from "@/lib/use-local-storage";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, ReactNode, useState } from "react";
import { useDropzone } from "react-dropzone";

type FileContent = { name: string; content: any, id: string };

interface DropzoneContextType {
  fileContents: FileContent[];
  setFileContents: any,
  isDragActive: boolean;
  isLoading: boolean
}

const DropzoneContext = createContext<DropzoneContextType | undefined>(undefined);

interface DropzoneProviderProps {
  children: ReactNode;
}

export const DropzoneProvider: React.FC<DropzoneProviderProps> = ({ children }) => {
  const [fileContents, setFileContents] = useLocalStorage<FileContent[]>('files', []);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const onDrop = async (acceptedFiles: File[]) => {
    setIsLoading(true)
    const jsonContents = await Promise.all(
      acceptedFiles.map((file) =>
        file.text().then((content) => ({
          name: file.name,
          content: JSON.parse(content),
          id: crypto.randomUUID()
        }))
      )
    );
    setFileContents((prev) => [...prev, ...jsonContents]);
    if (jsonContents[0] && jsonContents[0].id)
      router.push(`/jsonizer/${jsonContents[0].id}`)
    setIsLoading(false)
  };

  const { getRootProps, isDragActive } = useDropzone({
    accept: { "application/json": [".json"] },
    noClick: true,
    onDrop,
  });

  return (
    <DropzoneContext.Provider value={{ fileContents, setFileContents, isDragActive, isLoading }}>
      <div {...getRootProps()} className={"z-[500]"}>
        {children}
        {isLoading && <div className="fixed z-[504] inset-0 bg-background/10"></div>}
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
