import { MouseEvent, MouseEventHandler, useState } from "react";
import { DotLottieReact, DotLottie } from "@lottiefiles/dotlottie-react";
import crossWhite from "../../assets/lotties/cross-white.json"
import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import { enqueueSnackbar } from "notistack";

const UnsavedPasswordDialog = ({ close, saveAll }: { close: MouseEventHandler, saveAll: Function }) => {
  const forceCloseDialog = useContext(AppContext)?.forceCloseDialog
  const [iconCrossWhite, setIconCrossWhite] = useState<DotLottie>()

  const dotLottieRefCallbackIconCrossWhite = (dotLottie: DotLottie) => {
    setIconCrossWhite(dotLottie)
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={close}>
        <div className="bg-white min-w-[300px] max-w-[500px] w-1/2 rounded-xl overflow-hidden shadow-lg relative" onClick={(e: MouseEvent) => e.stopPropagation()}>
          <div className="relative bg-green-600 w-full py-2 px-6 shadow-lg z-[1]">
              <h2 className="text-white font-bold text-xl sm:text-2xl">Unsaved Passwords</h2>

              <DotLottieReact title="Close" onClick={close} className="absolute right-0 top-0 m-[10px] h-[28px] w-[28px] cursor-pointer" dotLottieRefCallback={dotLottieRefCallbackIconCrossWhite} data={crossWhite} loop={false} autoplay={false} onMouseEnter={() => iconCrossWhite?.play()} />
          </div>

          <div className='px-6 mt-6'>
            <p className="text-gray-600">There are unsaved password?</p>
          </div>

          <div className="flex justify-end gap-4 mt-4 p-4">
            <button className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition" onClick={() => { if (forceCloseDialog) forceCloseDialog(); enqueueSnackbar("Passwords didn't saved", {variant:"error"}) }}>Don't save</button>
            <button className="px-4 py-2 bg-green-600 rounded-lg text-white hover:bg-green-700 transition" onClick={saveAll as MouseEventHandler}>Save</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UnsavedPasswordDialog;
