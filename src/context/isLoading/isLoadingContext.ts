import { createContext } from "react";
import type { IsLoadingContextType } from "../../types";

export const IsLoadingContext = createContext<IsLoadingContextType>(
  {} as IsLoadingContextType,
);
