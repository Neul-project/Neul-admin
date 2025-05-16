import { useEffect, useRef } from "react";

interface Props {
  hasMore: boolean;
  loading: boolean;
  onIntersect: () => void;
  rootMargin?: string;
  threshold?: number;
}

export default function useInfiniteScroll({
  hasMore,
  loading,
  onIntersect,
  rootMargin = "100px",
  threshold = 0,
}: Props) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const targetRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!targetRef.current) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // console.log("IntersectionObserver callback:", entry.isIntersecting);
        if (entry.isIntersecting && hasMore && !loading) {
          console.log("무한 스크롤 타겟이 화면에 보임! onIntersect 호출");
          onIntersect();
        }
      },
      {
        threshold: 1,
        rootMargin: "0px 0px 100px 0px", // 아래쪽 100px 전에 호출되도록
      }
    );

    observerRef.current.observe(targetRef.current);

    return () => observerRef.current?.disconnect();
  }, [hasMore, loading, onIntersect, rootMargin, threshold]);

  return targetRef;
}
