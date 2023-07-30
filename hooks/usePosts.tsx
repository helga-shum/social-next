import useSwr from "swr";
import fetcher from "@/libs/fetcher";

const usePosts = () => {
  const { data, error, isLoading } = useSwr("/api/posts", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    data,
    error,
    isLoading,
  };
};

export default usePosts;
