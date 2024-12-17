import './App.css'
import { ThemeProvider } from "@/components/theme-provider"
import {CardWithForm} from "@/card.tsx";
import {ErrorDialog} from "@/components/error-dialog.tsx";
import {createContext, useState} from "react";

interface ErrorContextValue {
    dialog: string | null;
    setDialog: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ErrorContext = createContext<ErrorContextValue>({ dialog: null, setDialog: () => {} });

function App() {
    const [dialog, setDialog] = useState<string | null>(null);

    return (
      <ErrorContext.Provider value={{dialog, setDialog}}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <CardWithForm />
          <ErrorDialog/>
      </ThemeProvider>
      </ErrorContext.Provider>
  )
}

export default App
