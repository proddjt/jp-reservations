import { useContext } from "react";
import { MediaQueryContext } from "./MediaQueryContext";


export default function useMQuery() {
  return useContext(MediaQueryContext);
}