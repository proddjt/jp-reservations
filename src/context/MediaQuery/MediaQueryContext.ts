import { createContext } from "react";

export type MediaQueryContextType = {
  isMobile: boolean
}


export const MediaQueryContext = createContext<MediaQueryContextType>({} as MediaQueryContextType);