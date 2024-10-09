import { useState, useRef, MouseEvent, useContext } from "react";
import { AppContext } from "../../contexts/AppContext"
import add from "../../assets/lotties/plugin.json"
import eyeCross from "../../assets/lotties/eye-cross.json"
import crossWhite from "../../assets/lotties/cross-white.json"
import { DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";
import { enqueueSnackbar } from "notistack";

const AddPasswordDialog = ({ setThisVisible }: { setThisVisible: Function }) => {
  const apiAndRefetch = useContext(AppContext)?.apiAndRefetch;
  const setChanged = useContext(AppContext)?.setChanged;

  const [iconCrossWhite, setIconCrossWhite] = useState<DotLottie>()
  const dotLottieRefCallbackIconCrossWhite = (dotLottie: DotLottie) => {
    setIconCrossWhite(dotLottie)
  }

  const passwordField = useRef<HTMLInputElement>(null)

  const [showHideIcon, setShowHideIcon] = useState<DotLottie>()
  const dotLottieRefCallbackShowHideIcon = (dotLottie: DotLottie) => {
    setShowHideIcon(dotLottie);
  }

  const [iconAdd, seticonAdd] = useState<DotLottie>()
  const dotLottieRefCallbackIconAdd = (dotLottie: DotLottie) => {
    seticonAdd(dotLottie);
  }

  const [website, setWebsite] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleShowHidePassword = () => {
    if (passwordField.current?.type === "password") {
      showHideIcon?.setMode("forward")
      showHideIcon?.play()
      passwordField.current.type = "text";
    } else if (passwordField.current?.type === "text") {
      showHideIcon?.setMode("reverse")
      showHideIcon?.play()
      passwordField.current.type = "password";
    }
  }

  const [errorWebsite, setErrorWebsite] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  const addPassword = async () => {
    if (!website) {
      enqueueSnackbar("Website url is required", { variant: "error" })
      setErrorWebsite(true)
    } else if (!website.match(/^(https?:\/\/)?([a-zA-Z0-9-]+\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}\/?/)) {
      enqueueSnackbar("Enter a valid website", { variant: "error" })
      setErrorWebsite(true)
    }else if (!email) {
      enqueueSnackbar("Email is required", { variant: "error" })
      setErrorEmail(true)
    } else if(!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
      enqueueSnackbar("Enter a valid email", { variant: "error" })
      setErrorEmail(true)
    }else if (!password) {
      enqueueSnackbar("Enter a valid password", { variant: "error" })
      setErrorPassword(true)
    } else {
      const web = website.match(/^(?:https?:\/\/)?(?:www\.)?([^\/]+)/)?.[1] 
      setThisVisible(false)
      if (apiAndRefetch) await apiAndRefetch("/passwords", "POST", { website: web, email, password })
      if (setChanged) setChanged(true)
      enqueueSnackbar("New password saved successfully", { variant: "success" })
      }
  }

  return (
    <>
      <div className="grid place-items-center fixed inset-0 bg-black bg-opacity-50" onClick={() => setThisVisible(false)}>
        <div className="w-[90%] sm:w-3/4 lg:w-1/2 rounded-xl overflow-hidden text-gray-400" onClick={(e: MouseEvent) => e.stopPropagation()}>
          <div className="relative bg-green-600 w-full p-4 shadow-lg z-[1]">
            <h2 className="text-white font-bold text-center text-xl sm:text-2xl">Add Password</h2>

            <DotLottieReact title="Close" onClick={() => setThisVisible(false)} className="absolute right-0 top-0 m-[18px] h-[28px] w-[28px] cursor-pointer" dotLottieRefCallback={dotLottieRefCallbackIconCrossWhite} data={crossWhite} loop={false} autoplay={false} onMouseEnter={() => iconCrossWhite?.play()} />
          </div>

          <div className="flex flex-col bg-white text-gray-600 relative overflow-y-auto p-4 max-h-96 gap-4">
            <div className="flex max-sm:flex-col sm:gap-5 justify-between sm:items-center relative">
              <label htmlFor="website" className="text-gray-600 max-sm:font-bold">Website: </label>
              <input onChange={e => {setWebsite(e.target.value); setErrorWebsite(false)}} placeholder="e.g, facebook.com" className={`w-full ${errorWebsite && "ring-2 ring-red-600"} text-black pr-[35px] bg-gray-100 border-gray-300 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600`} type="text" name="website" id="website" />
            </div>

            <div className="flex gap-4">
              <div className="flex max-sm:flex-col sm:gap-5 justify-between sm:items-center relative">
                <label htmlFor="email" className="text-gray-600 max-sm:font-bold">Email: </label>
                <input onChange={e => {setEmail(e.target.value); setErrorEmail(false)}} placeholder="email@example.com" className={`w-full ${errorEmail && "ring-2 ring-red-600"} text-black pr-[35px] bg-gray-100 border-gray-300 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600`} type="text" name="email" id="email" />
              </div>

              <div className="flex max-sm:flex-col sm:gap-5 justify-between sm:items-center relative">
                <label htmlFor="password" className="text-gray-600 max-sm:font-bold">Password: </label>
                <input onChange={e => {setPassword(e.target.value); setErrorPassword(false)}} placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;" ref={passwordField} className={`w-full ${errorPassword && "ring-2 ring-red-600"} text-black pr-[35px]"} pr-[86px] bg-gray-100 border-gray-300 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600`} type="password" name="password" id="password" />
                <DotLottieReact speed={4} onClick={handleShowHidePassword} title="Show/Hide" className="h-[28px] absolute right-0 m-[7px] bottom-0 w-[28px] cursor-pointer" dotLottieRefCallback={dotLottieRefCallbackShowHideIcon} data={eyeCross} autoplay={false} loop={false} />
              </div>
            </div>

            <button onClick={addPassword} title="Add" className="bg-green-600 text-white p-2 rounded-xl flex justify-center items-center gap-2 text-lg font-semibold" onMouseEnter={() => iconAdd?.play()} >
              <p>Add</p>
              <DotLottieReact className="h-[28px] w-[28px]" dotLottieRefCallback={dotLottieRefCallbackIconAdd} data={add} autoplay={false} loop={false} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddPasswordDialog;
