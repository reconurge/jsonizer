import { DropzoneProvider } from "@/components/dropzone/dropzone-provider"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <DropzoneProvider>
            {children}
        </DropzoneProvider>
    )
}
