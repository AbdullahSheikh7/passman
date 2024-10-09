import { useContext, MouseEvent, useState } from "react";
import crossWhite from "../../assets/lotties/cross-white.json"
import Password from "../../types/Password";
import ShowAuth from "./showPassword/ShowAuth";
import { DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";
import { AppContext } from "../../contexts/AppContext.js"

const ShowPasswordDialog = ({ addAllAuths, website, passwordData, closeDialog }: { addAllAuths: Function, website: string, passwordData: Password[], closeDialog: Function }) => {
  const [iconCrossWhite, setIconCrossWhite] = useState<DotLottie>()

  const dotLottieRefCallbackIconCrossWhite = (dotLottie: DotLottie) => {
    setIconCrossWhite(dotLottie)
  }

  const apiAndRefetch = useContext(AppContext)?.apiAndRefetch;
  const setChanged = useContext(AppContext)?.setChanged;

  const [forceCloseAttempted, setForceCloseAttempted] = useState<boolean>(false)

  const savePassword = async (id: string, body: {email: string, password: string}) => {
    if (apiAndRefetch) await apiAndRefetch(`/passwords/${id}`, "PUT", body)
    if (setChanged) setChanged(true)
  }

  return (
    <>
      <div className="grid place-items-center fixed inset-0 bg-black bg-opacity-50" onClick={() => {closeDialog(); setForceCloseAttempted(true)}}>
        <div className="w-[90%] sm:w-3/4 lg:w-1/2 rounded-xl overflow-hidden text-gray-400" onClick={(e: MouseEvent) => e.stopPropagation()}>
          <div className="relative bg-green-600 w-full p-4 shadow-lg z-[1]">
            <h2 className="text-white font-bold text-center text-xl sm:text-2xl">{website}</h2>

            <DotLottieReact title="Close" onClick={() => {closeDialog(); setForceCloseAttempted(true) }} className="absolute right-0 top-0 m-[18px] h-[28px] w-[28px] cursor-pointer" dotLottieRefCallback={dotLottieRefCallbackIconCrossWhite} data={crossWhite} loop={false} autoplay={false} onMouseEnter={() => iconCrossWhite?.play()} />
          </div>

          <div className="bg-white text-gray-600 relative overflow-y-auto p-4 max-h-96">
            <div className="flex flex-col gap-4">
              {passwordData.map((auth, i) => <ShowAuth ref={(element) => { addAllAuths(i, element) }} key={auth._id} auth={auth} saveAuthFunc={savePassword} forceCloseAttempted={forceCloseAttempted} setForceCloseAttempted={setForceCloseAttempted} />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShowPasswordDialog;
