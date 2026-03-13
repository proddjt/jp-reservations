import { type ReactNode } from "react";
import { MediaQueryContext } from "./MediaQueryContext";
import { useMediaQuery } from "@mantine/hooks";

export function MediaQueryProvider({ children } : {children : ReactNode}){
  const isMobile = useMediaQuery('(max-width: 62em)');
  return (
    <MediaQueryContext.Provider value={{isMobile}}>
      {children}
    </MediaQueryContext.Provider>
  );
}