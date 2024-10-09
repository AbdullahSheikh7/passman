import arrow from "../assets/lotties/arrow.json"
import bin from "../assets/lotties/delete.json"
import { useState } from "react";
import PasswordsData from "../types/PasswordsData";
import { DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const PasswordsTable = ({ passwordsData, openDialog, search }: { passwordsData: PasswordsData, openDialog: Function, search: string }) => {
  const deletePassword = useContext(AppContext)?.deletePassword;

  let index: number = 0

  return (
    <>
      <table className="w-full">
        <tbody>
          {passwordsData.map(password => {
            const [iconShow, setIconShow] = useState<DotLottie>()
            const [iconDelete, setIconDelete] = useState<DotLottie>()
            let isInSearch: boolean = true

            if (password.website.includes(search)) {
              isInSearch = true
            } else {
              isInSearch = false
            }

            password.auths.forEach(auth => {
              if (auth.email.includes(search) || auth.password.includes(search)) {
                isInSearch = true
              }
            })


            const dotLottieRefCallbackIconShow = (dotLottie: DotLottie) => {
              setIconShow(dotLottie)
            }
            const dotLottieRefCallbackIconDelete = (dotLottie: DotLottie) => {
              setIconDelete(dotLottie)
            }

            if (isInSearch) {
              index++;
              return (
                <tr key={password._id} className="cursor-pointer flex justify-between items-center p-4 border-b" onMouseEnter={() => iconShow?.play()} onClick={() => { openDialog(password.website, password.auths) }}>
                  <td className="text-lg">{password.website}</td>
                  <td className="flex gap-5">
                    <button>
                      <DotLottieReact title="Show" className="h-[28px] w-[28px] cursor-pointer" dotLottieRefCallback={dotLottieRefCallbackIconShow} data={arrow} loop={false} autoplay={false} />
                    </button>
                    <button>
                      <DotLottieReact title="Delete" onClick={(e) => {e.stopPropagation(); if (deletePassword) deletePassword(password._id, password.website)}} className="h-[28px] w-[28px] cursor-pointer" dotLottieRefCallback={dotLottieRefCallbackIconDelete} data={bin} loop={false} autoplay={false} onMouseEnter={() => iconDelete?.play()} />
                    </button>
                  </td>
                </tr>
              )
            } else { <></> }
          })}
          {index === 0 && (
            <tr className="grid place-items-center p-10 border-b">
              <td className="text-xl">No passwords found</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  )
}

export default PasswordsTable