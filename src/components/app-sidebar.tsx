"use client"
import * as React from "react"
import { ChevronRight, File, Folder, TrashIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useDropzoneContext } from "./dropzone/dropzone-provider"
import Link from "next/link"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"



export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { fileContents } = useDropzoneContext()
  const data = {
    tree: [{
      name: "Local storage",
      items: fileContents.map((file) => ({ name: file.name, id: file.id }))
    }]
  }


  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            {fileContents.length === 0 ? <span className="italic mx-3">No file yet.</span> :
              <SidebarMenu>
                {data.tree.map((tree, index) => (<Tree key={index} data={tree} />))
                }
              </SidebarMenu>}
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarRail />
      </SidebarContent>
      <div className="p-2 text-end"><ModeToggle /></div>
    </Sidebar>
  )
}

function Tree({ data }: { data: any }) {
  const { setFileContents } = useDropzoneContext()
  const handleDeleteItem = (id: string) => {
    setFileContents((prev: any[]) => prev.filter((a) => a.id !== id))
  }
  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={true}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <Folder />
            {data.name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {data.items.map((subItem: any) => (
              <div key={subItem.id}
                className="flex items-center gap-1">
                <SidebarMenuButton
                  className="data-[active=true]:bg-transparent"
                >
                  <File />
                  <Link href={`/jsonizer/${subItem?.id}`} className="">{subItem?.name}</Link>
                </SidebarMenuButton>
                <Button onClick={() => handleDeleteItem(subItem?.id)} size={"icon"} variant={"ghost"}><TrashIcon className="h-2 w-2" /></Button>
              </div>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  )
}
