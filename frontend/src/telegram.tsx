import { createContext, useContext, type PropsWithChildren } from 'react';

interface TelegramState {
      isLoading: boolean;
        isTelegram: boolean;
          error: string | null;
            userName: string;
              themeParams: object;
                openFullExperience: () => void;
}

const TelegramContext = createContext<TelegramState>({
      isLoading: false,
        isTelegram: false,
          error: null,
            userName: 'ضيف',
              themeParams: {},
                openFullExperience: () => {},
});

export function TelegramProvider({ children }: PropsWithChildren<{}>) {
      return (
            <TelegramContext.Provider value={{
                      isLoading: false,
                            isTelegram: true,
                                  error: null,
                                        userName: 'ضيف',
                                              themeParams: {},
                                                    openFullExperience: () => {},
            }}>
                  {children}
                      </TelegramContext.Provider>
      );
}

export function useTelegram() {
      return useContext(TelegramContext);
}
