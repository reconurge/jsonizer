import { AppSidebar } from "@/components/app-sidebar"
import { DropzoneProvider } from "@/components/dropzone/dropzone-provider"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function Page({ children }: { children: React.ReactNode }) {
    return (
        <DropzoneProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex flex-1 flex-col gap-4">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </DropzoneProvider>
    )
}
