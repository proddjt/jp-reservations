import { useTransition, type ReactNode } from "react";
import { IsLoadingContext } from "./isLoadingContext";

export function IsLoadingProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition();

  /**
   * Funzione che permette di far partire una transition
   * aggiornando il valore di isPending
   *
   * @function module:IsLoadingProvider~showLoader
   * @param {function} f - La funzione asincrona da eseguire
   */

  const showLoader = (f: () => Promise<void>) => {
    startTransition(() => f());
  };

  return (
    <IsLoadingContext.Provider value={{ showLoader, isPending }}>
      {children}
    </IsLoadingContext.Provider>
  );
}
