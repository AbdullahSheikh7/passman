import { createContext, MutableRefObject, SetStateAction } from "react"

export const AppContext = createContext<{ editOpened: MutableRefObject<string[]>, setChanged: React.Dispatch<boolean>, forceCloseDialog: Function, apiAndRefetch: Function, setElementToDelete: React.Dispatch<SetStateAction<"auth" | "password" | null>>, deletePassword: Function, deleteAuth: Function, id: string, deleteYes: Function, deletedAuths: string[], setDeletedAuths: React.Dispatch<SetStateAction<string[]>> }|null>(null)
