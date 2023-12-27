"use client";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { PropsWithChildren } from "react";
import { ChatNav } from "@/app/chat/components/chat-layout/chat-nav";
import ChatNavHeader from "@/app/chat/components/chat-layout/chat-nav-header";

interface MainLayout extends PropsWithChildren {
  defaultLayout: number[] | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

const MainLayout: React.FC<MainLayout> = ({
  defaultLayout = [265, 440, 655],
  defaultCollapsed = false,
  navCollapsedSize,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`;
      }}
      className="!h-screen items-stretch"
    >
      <ResizablePanel
        defaultSize={defaultLayout[0]}
        collapsedSize={navCollapsedSize}
        collapsible={false}
        minSize={15}
        maxSize={20}
        onCollapse={(collapsed) => {
          setIsCollapsed(collapsed);
          document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
            collapsed
          )}`;
        }}
        className={cn(
          isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out"
        )}
      >
        <ChatNavHeader />
        <Separator />
        <ChatNav />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
        {children}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default MainLayout;
