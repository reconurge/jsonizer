import { AppSidebar } from "@/components/app-sidebar"
import { DropzoneProvider } from "@/components/dropzone/dropzone-provider"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <DropzoneProvider>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <div className="flex flex-1 flex-col">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </DropzoneProvider>
    )
}
