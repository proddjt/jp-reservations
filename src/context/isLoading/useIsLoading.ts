import { useContext } from "react";
import { IsLoadingContext } from "./isLoadingContext";

export default function useIsLoading() {
  return useContext(IsLoadingContext);
}
