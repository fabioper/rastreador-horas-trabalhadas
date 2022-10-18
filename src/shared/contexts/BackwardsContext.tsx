import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react"

interface BackwardsContextProps {
  backwardsPath?: string
  setBackwardsPath: Dispatch<SetStateAction<string | undefined>>
}

export const BackwardsContext = createContext<BackwardsContextProps>(
  {} as BackwardsContextProps
)

export function useBackwardsContext() {
  return useContext(BackwardsContext)
}

export function useBackwardsPath(path: string) {
  const { setBackwardsPath } = useBackwardsContext()

  useEffect(() => {
    setBackwardsPath(path)
    return () => setBackwardsPath(undefined)
  }, [])
}

function BackwardsProvider({ children }: React.PropsWithChildren) {
  const [backwardsPath, setBackwardsPath] = useState<string>()

  return (
    <BackwardsContext.Provider value={{ backwardsPath, setBackwardsPath }}>
      {children}
    </BackwardsContext.Provider>
  )
}

export default BackwardsProvider
