"use client"

import {
  IconArmchair,
  IconArmchair2,
  IconDatabase,
  IconDice,
  IconEdit,
  IconFileTypePng,
  IconMail,
  IconUsers,
} from "@tabler/icons-react"
import Link from 'next/link';
import { useSession } from "next-auth/react";
import * as React from "react"

import { NavUser } from "@/components/sidebar/nav/nav-user"
import { SidebarNav } from "@/components/sidebar/nav/sidebar-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar({
  ...props
}) {
  // useSessionはコンポーネント内で呼び出す
  const { data: session } = useSession();
  const user = session?.user;

  // データ構造
  const data = {
    navMain: [
      {
        name: "抽選",
        url: "/",
        icon: IconDice,
      },
      {
        name: "座席表",
        url: "/map",
        icon: IconArmchair,
      },
    ],
    dataList: [
      {
        name: "チーム予約",
        url: "/appoint",
        icon: IconUsers,
      },
      {
        name: "座席図 編集",
        url: "/map-edit",
        icon: IconEdit,
      },
      {
        name: "座席図 画像",
        url: "/map-img",
        icon: IconFileTypePng,
      },
      {
        name: "データ管理",
        url: "/data-management",
        icon: IconDatabase,
      },
    ],
    navSecondary: [
      {
        name: "問い合わせ",
        url: "/contact",
        icon: IconMail,
      },
    ],
    user: {
      lastName: user?.lastName ?? "取得失敗",
      employeeNumber: user?.employeeNumber ?? "取得失敗",
      avatar: `/avatars/${user?.employeeNumber}.png`,
    },
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/">
                <IconArmchair2 className="!size-5" />
                <span className="text-base font-semibold">座席管理システム</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNav
          items={data.navMain}
          className="flex flex-col gap-2"
        />
        {user?.adminFlag && (
          <SidebarNav
            items={data.dataList}
            className="group-data-[collapsible=icon]:hidden"
            label="管理者"
          />
        )}
        <SidebarNav 
          items={data.navSecondary} 
          className="mt-auto" 
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
