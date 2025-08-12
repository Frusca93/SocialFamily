import { createContext, useContext } from 'react';

export type ScrollToPostFn = (postId: string) => void;

export const ScrollToPostContext = createContext<ScrollToPostFn | undefined>(undefined);

export function useScrollToPost() {
  return useContext(ScrollToPostContext);
}
