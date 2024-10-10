import PasswordsTable from "../components/PasswordsTable";
import {
  useRef,
  MouseEvent,
  MouseEventHandler,
  useEffect,
  useState,
} from "react";
import PasswordsData from "../types/PasswordsData";
import Spinner from "../components/Spinner";
import add from "../assets/lotties/plus.json";
import search from "../assets/lotties/search.json";
import ShowPasswordDialog from "../components/dialogs/ShowPasswordDialog";
import cross from "../assets/lotties/cross.json";
import Password from "../types/Password";
import { AppContext } from "../contexts/AppContext";
import { DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";
import UnsavedPasswordDialog from "../components/dialogs/UnsavedPasswordDialog";
import AddPasswordDialog from "../components/dialogs/AddPasswordDialog";
import { saveChildHandle } from "../components/dialogs/showPassword/ShowAuth";
import { enqueueSnackbar } from "notistack";
import DeleteDialog from "../components/dialogs/DeleteDialog";

const backend = import.meta.env.VITE_BACKEND;

const Home = () => {
  const [passwordsData, setPasswordsData] = useState<PasswordsData>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [changed, setChanged] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [deletePasswordDialog, setDeletePasswordDialog] = useState<boolean>(false)
  const [elementToDelete, setElementToDelete] = useState<"auth" | "password"| null>(null)
  const [deletedAuths, setDeletedAuths] = useState<string[]>([])

  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [dialogData, setDialogData] = useState<Password[]>([]);
  const [dialogWebsite, setDialogWebsite] = useState<string>("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [id, setId] = useState<string>("")

  const [iconAdd, setIconAdd] = useState<DotLottie>();
  const [iconSearch, setIconSearch] = useState<DotLottie>();
  const [iconCross, setIconCross] = useState<DotLottie>();

  const allAuths = useRef<(saveChildHandle | null)[]>([])

  const addAllAuths = (i: number, d: saveChildHandle) => {
    allAuths.current[i] = d
  }

  const deleteYes = () => {
    if (elementToDelete === "password") {
      setDialogWebsite("")
    }
    setDeletePasswordDialog(false)
    setElementToDelete(null)
    setId("")
  }

  const deletePassword = (id: string, website: string) => {
    setDialogWebsite(website)
    setDeletePasswordDialog(true)
    setElementToDelete("password")
    setId(id)
  }
  
  const deleteAuth = (id: string) => {
    setDeletePasswordDialog(true)
    setElementToDelete("auth")
    setId(id)
  }

  const saveAll = () => {
    setDiscardConfirmationDialog(false);
    let close: boolean = true;
    allAuths.current.forEach((auth) => {
      if (auth) {
        const res: boolean = auth.savingAll()
        if (!res) {
          close = false;
        }
      };
    })
    if (close) {
      forceCloseDialog();
      enqueueSnackbar("All passwords saved successfully", { variant: "success" })
    }
  }

  const [discardConfirmationDialog, setDiscardConfirmationDialog] = useState<boolean>(false);

  const editOpened = useRef<string[]>([]);

  const api = async (url: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", body?: {}) => {
    await fetch(backend+url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)
    })
    .catch(err => console.log(err))
  };

  useEffect(() => {
    (async () => {
      if (changed) {
        setChanged(false)
        return;
      }

      setLoading(true);

      const data: PasswordsData = (await fetch(`${backend}/passwords`).then(res => res.json())).data
      setPasswordsData(data);

      setLoading(false);
    })();
  }, [changed]);

  const dotLottieRefCallbackIconAdd = (dotLottie: DotLottie) => {
    setIconAdd(dotLottie);
  };
  const dotLottieRefCallbackIconSearch = (dotLottie: DotLottie) => {
    setIconSearch(dotLottie);
  };
  const dotLottieRefCallbackIconCross = (dotLottie: DotLottie) => {
    setIconCross(dotLottie);
  };

  const openDialog = (website: string, data: Password[]) => {
    setIsDialogOpen(true);
    setDialogData(data);
    setDialogWebsite(website);
  };

  const forceCloseDialog = () => {
    editOpened.current = [];
    setIsDialogOpen(false);
    setDialogWebsite("");
    setDiscardConfirmationDialog(false);
  };

  const closeDialog = () => {
    if (editOpened.current.length === 0) {
      setIsDialogOpen(false);
      setDialogWebsite("");
      setDiscardConfirmationDialog(false);
    } else {
      setDiscardConfirmationDialog(true);
    }
  };

  const closeDiscardConfirmation: MouseEventHandler = (e: MouseEvent) => {
    e.stopPropagation();
    setDiscardConfirmationDialog(false);
  };

  const setSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setSearchQuery("")
  };

  const closeDeleteDialog = () => {setElementToDelete(null); setDeletePasswordDialog(false)}

  const searchBox = useRef<HTMLInputElement>(null);

  return (
    <>
      <AppContext.Provider
        value={{ editOpened, setChanged, forceCloseDialog, api, setElementToDelete, deletePassword, deleteAuth, id, deleteYes, deletedAuths, setDeletedAuths }}
      >
        <div className="mx-auto w-[90%] sm:w-4/5 lg:w-3/5 py-20 flex flex-col items-center h-screen">
          <h1
            className="text-4xl sm:text-6xl font-extrabold mb-10 select-none"
          >
            <span className="text-green-600">&lt;</span>
            <span>Pass</span>
            <span className="text-green-600">man</span>
            <span>&#47;</span>
            <span className="text-green-600">&gt;</span>
          </h1>

          <div className="relative flex justify-between items-center bg-green-600 w-full p-4 shadow-lg z-[0] rounded-tl-xl rounded-tr-xl">
            <input
              type="search"
              name="search-query"
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              id="search-query-box"
              placeholder="Search Passwords"
              ref={searchBox}
              className={`transition-[clip-path] text-lg duration-500 ease-out absolute ${
                isSearchOpen ? "searchOn" : "searchOff"
              } top-0 left-0 rounded-tl-xl rounded-tr-xl h-full w-full text-black pr-[64px] bg-gray-100 border-gray-300 px-4 py-2 border focus:outline-none`}
            />
            {isSearchOpen && (
              <DotLottieReact
                onClick={setSearch}
                title="Cancel"
                className="z-10 h-[28px] w-[28px] absolute cursor-pointer right-0 m-[18px]"
                dotLottieRefCallback={dotLottieRefCallbackIconCross}
                data={cross}
                loop={false}
                autoplay={false}
                onMouseEnter={() => iconCross?.play()}
              />
            )}
            <DotLottieReact
              onClick={() => {setIsAddDialogOpen(true)}}
              data={add}
              title="Add"
              className="h-[28px] w-[28px] cursor-pointer"
              onMouseEnter={() => iconAdd?.play()}
              dotLottieRefCallback={dotLottieRefCallbackIconAdd}
              loop={false}
              autoplay={false}
            />

            <h2 className="text-white font-bold text-center text-xl sm:text-2xl">
              Your Passwords
            </h2>

            <DotLottieReact
              onClick={setSearch}
              data={search}
              title="Search"
              className="h-[28px] w-[28px] cursor-pointer"
              onMouseEnter={() => iconSearch?.play()}
              dotLottieRefCallback={dotLottieRefCallbackIconSearch}
              loop={false}
              autoplay={false}
            />
          </div>

          <div className="bg-white w-full shadow-lg overflow-y-auto rounded-bl-xl rounded-br-xl">
            {loading ? (
              <Spinner stroke="stroke-gray-600" />
            ) : (
              <PasswordsTable
                search={searchQuery}
                passwordsData={passwordsData}
                openDialog={openDialog}
              />
            )}
          </div>

          {isDialogOpen && (
            <ShowPasswordDialog
              addAllAuths={addAllAuths}
              website={dialogWebsite}
              passwordData={dialogData}
              closeDialog={closeDialog}
            />
          )}

          {isAddDialogOpen && (
            <AddPasswordDialog setThisVisible={setIsAddDialogOpen} />
          )}

          {discardConfirmationDialog && (
            <UnsavedPasswordDialog close={closeDiscardConfirmation} saveAll={saveAll} />
          )}

          {elementToDelete && deletePasswordDialog && <DeleteDialog element={elementToDelete} website={dialogWebsite} close={closeDeleteDialog} />}
        </div>
      </AppContext.Provider>
    </>
  );
};

export default Home;
