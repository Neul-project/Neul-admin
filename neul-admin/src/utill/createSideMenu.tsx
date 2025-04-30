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
 * children생성 후 object형식으로 넣으시면 됩니다~
 * 무조건 page하위 폴더 생성 후 연결해 주세요~
 */
export const sidebarMenus = createSidebarMenus([
  {
    key: "/",
    label: "대시보드",
  },
  {
    key: "/users",
    label: "회원 관리",
    children: [
      {
        key: "/users/manage",
        label: "회원 정보",
      },
    ],
  },
]);
