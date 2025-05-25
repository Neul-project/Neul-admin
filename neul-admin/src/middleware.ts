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
    pathname.match(/\.(.*)$/)
  );
}

//PUBLIC_PATHS 내 경로를 제외한 모든 경로에 로그인 시 발급되는 토큰의 유무를 검사
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 정적 파일 또는 API는 무시
  if (isPublicFile(pathname)) {
    return NextResponse.next();
  }

  const access_token = req.cookies.get("access_token")?.value;
  const isPublic = PUBLIC_PATHS.includes(pathname);

  // 인증 필요 경로인데 토큰이 없으면 로그인 페이지로 리다이렉트
  if (!isPublic && !access_token) {
    // 단순히 로그인 페이지로만 이동
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
