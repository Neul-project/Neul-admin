import { useEffect } from "react";

interface Props {
  onIntersect: () => void;
  hasMore: boolean;
  loading: boolean;
  rootMargin?: string;
}

const useTopInfiniteScroll = (
  targetRef: React.RefObject<HTMLElement>,
  { onIntersect, hasMore, loading, rootMargin = "300px" }: Props
) => {
  useEffect(() => {
    if (!targetRef.current || loading || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && hasMore) {
          onIntersect();
        }
      },
      {
        root: targetRef.current.parentElement, // 스크롤되는 부모
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [targetRef, loading, hasMore, onIntersect, rootMargin]);
};

export default useTopInfiniteScroll;
