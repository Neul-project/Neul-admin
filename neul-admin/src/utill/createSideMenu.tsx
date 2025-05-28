import Link from "next/link";
import type { MenuProps } from "antd";

export const createSidebarMenus = (menus: MenuProps["items"]): any => {
  if (!menus) return menus;

  return menus.map((menu) => {
    if (!menu || !("label" in menu)) return menu;

    if ("children" in menu) {
      return {
        ...menu,
        children: createSidebarMenus(menu.children),
      };
    }

    return {
      ...menu,
      label: <Link href={menu.key as string}>{menu.label}</Link>,
    };
  });
};

export const sidebarMenus = createSidebarMenus([
  {
    key: "/",
    label: "담당 회원",
  },
  {
    key: "/matching",
    label: "매칭 관리",
  },
  {
    key: "/activity/write",
    label: "활동기록",
  },
  {
    key: "/status",
    label: "상태기록",
  },
  {
    key: "/feedback",
    label: "피드백",
  },
  {
    key: "/schedule",
    label: "일정표",
  },
  {
    key: "/chat",
    label: "채팅",
  },
  {
    key: "/paylist",
    label: "정산하기",
  },
  {
    key: "/mypage",
    label: "마이페이지",
  },
]);
