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

/**
 * 에시 : key는 연결될 url, label은 이름입니다.
 * 만약 아래에 하나 더 만들어야 하는 경우에
 * children생성 후 object형식
 * 무조건 page하위 폴더 생성 후 연결
 */
export const sidebarMenus = createSidebarMenus([
  {
    key: "/users",
    label: "담당 회원",
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
    key: "/matching",
    label: "매칭 관리",
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
    key: "/mypage",
    label: "마이페이지",
  },
]);
