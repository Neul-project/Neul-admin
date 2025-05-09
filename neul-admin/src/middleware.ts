// 서버에서 실행되는 파일임, 브라우저 전용 객체 사용 불가
import { NextRequest, NextResponse } from "next/server";

// 로그인 없이 접근 가능한 경로 목록
const PUBLIC_PATHS = ["/login"];

// 정적 파일이나 API 요청인지 확인
function isPublicFile(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(.*)$/) // 정적 파일 (.js, .css, .png 등)
  );
}

//PUBLIC_PATHS 내 경로를 제외한 모든 경로에 로그인 시 발급되는 토큰의 유무를 검사
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 정적파일, api요청은 검사 건너뛰기
  if (isPublicFile(pathname)) {
    return NextResponse.next();
  }

  const access_token = req.cookies.get("access_token")?.value;

  // 토큰 없어도 접근 허용
  const isPublic = PUBLIC_PATHS.some((path) => pathname === path);

  // 토큰 없으면 로그인 페이지로 리다이렉트
  if (!isPublic && !access_token) {
    const loginUrl = new URL("/login", req.url);

    // 리다이렉트할 URL에 쿼리 문자열을 붙임 / pages > login에서 처리
    loginUrl.searchParams.set("reason", "auth");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
