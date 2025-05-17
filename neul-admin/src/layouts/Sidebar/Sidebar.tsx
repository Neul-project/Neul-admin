import React, { memo, ReactNode } from "react";
import { useRouter } from "next/router";
import { SidebarStyled } from "./styled";

import { Layout, Menu, ConfigProvider } from "antd";
import clsx from "clsx";
import { sidebarMenus } from "@/utill/createSideMenu";
//import { StatusTheme } from "@/components/StatusWrite/styled";
import { AntdGlobalTheme } from "@/utill/antdtheme";
import { GreenTheme } from "@/utill/antdtheme";

export interface SidebarProps {
  className?: string;
  children?: ReactNode;
}

const Sidebar = ({ className, children }: SidebarProps) => {
  const router = useRouter();

  return (
    <ConfigProvider theme={GreenTheme}>
      <SidebarStyled className={clsx("Sidebar", className)}>
        <div>
          {/*
        // @ts-ignore */}
          <Layout>
            <Layout.Sider width={200}>
              <Menu
                mode="inline"
                items={sidebarMenus}
                selectedKeys={[router.pathname]}
                defaultOpenKeys={router.pathname.split("/").slice(1, -1)}
                style={{ height: "100%", borderRight: 0 }}
              />
            </Layout.Sider>

            <Layout style={{ marginLeft: 200 }}>
              <Layout.Content
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280,
                }}
              >
                <div style={{ padding: "24px" }}>{children}</div>
              </Layout.Content>
            </Layout>
          </Layout>
        </div>
      </SidebarStyled>
    </ConfigProvider>
  );
};

export default memo(Sidebar);
