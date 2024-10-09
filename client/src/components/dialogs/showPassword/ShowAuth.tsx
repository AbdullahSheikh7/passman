import React, { useRef, useContext, useState, useEffect, useImperativeHandle, forwardRef } from "react"
import Password from "../../../types/Password"
import bin from "../../../assets/lotties/delete.json"
import binDisabled from "../../../assets/lotties/delete-disabled.json"
import edit from "../../../assets/lotties/edit.json"
import editDisabled from "../../../assets/lotties/edit-disabled.json"
import tick from "../../../assets/lotties/tick.json"
import tickDisabled from "../../../assets/lotties/tick-disabled.json"
import cross from "../../../assets/lotties/cross.json"
import crossDisabled from "../../../assets/lotties/cross-disabled.json"
import copy from "../../../assets/lotties/copy.json"
import copyDisabled from "../../../assets/lotties/copy-disabled.json"
import eyeCross from "../../../assets/lotties/eye-cross.json"
import { AppContext } from "../../../contexts/AppContext"
import { DotLottie, DotLottieReact } from "@lottiefiles/dotlottie-react"
import { closeSnackbar, enqueueSnackbar } from "notistack"

export type saveChildHandle = {savingAll: Function}

type Props = { auth: Password, forceCloseAttempted: boolean, setForceCloseAttempted: React.Dispatch<boolean>, saveAuthFunc: Function }

const ShowAuth = forwardRef<saveChildHandle, Props>(({ auth, forceCloseAttempted, setForceCloseAttempted, saveAuthFunc }, ref) => {
  const [iconDelete, setIconDelete] = useState<DotLottie>()
  const [iconEdit, setIconEdit] = useState<DotLottie>()
  const [iconTick, setIconTick] = useState<DotLottie>()
  const [iconCross, setIconCross] = useState<DotLottie>()
  const [iconCopyEmail, setIconCopyEmail] = useState<DotLottie>()
  const [iconCopyPassword, setIconCopyPassword] = useState<DotLottie>()

  const dotLottieRefCallbackIconDelete = (dotLottie: DotLottie) => {
    setIconDelete(dotLottie);
  }
  const dotLottieRefCallbackIconEdit = (dotLottie: DotLottie) => {
    setIconEdit(dotLottie);
  }
  const dotLottieRefCallbackIconTick = (dotLottie: DotLottie) => {
    setIconTick(dotLottie);
  }
  const dotLottieRefCallbackIconCross = (dotLottie: DotLottie) => {
    setIconCross(dotLottie);
  }
  const dotLottieRefCallbackIconCopyEmail = (dotLottie: DotLottie) => {
    setIconCopyEmail(dotLottie);
  }
  const dotLottieRefCallbackIconCopyPassword = (dotLottie: DotLottie) => {
    setIconCopyPassword(dotLottie);
  }

  const [editMode, setEditMode] = useState<boolean>(false)

  const editOpened = useContext(AppContext)?.editOpened;
  const deleteAuth = useContext(AppContext)?.deleteAuth;
  const deletedAuths = useContext(AppContext)?.deletedAuths;

  const emailField = useRef<HTMLInputElement>(null)
  const passwordField = useRef<HTMLInputElement>(null)

  const [showHideIcon, setShowHideIcon] = useState<DotLottie>()
  const dotLottieRefCallbackShowHideIcon = (dotLottie: DotLottie) => {
    setShowHideIcon(dotLottie);
  }

  const enterEditMode = () => {
    editOpened?.current.push(auth._id)
    setEditMode(true)
  }

  const saveAndCancelEditMode = () => {
    if (!email) {
      enqueueSnackbar("Email is required", { variant: "error" })
      setErrorEmail(true)
    }else if (!email.match(/[\w]+@[\w]+.[a-z]{2,}$/)) {
      enqueueSnackbar("Enter a valid email", { variant: "error" })
      setErrorEmail(true)
    }else if (!password) {
      enqueueSnackbar("Password is required", { variant: "error" })
      setErrorPassword(true)
    } else {
      saveAuthFunc(auth._id, {email, password})
      editOpened?.current.splice(editOpened?.current.indexOf(auth._id), 1)
      setEditMode(false)
      return true;
    }
    return false;
  }

  useImperativeHandle(ref, () => ({
    savingAll: saveAndCancelEditMode
  }))

  const cancelEditMode = () => {
    editOpened?.current.splice(editOpened?.current.indexOf(auth._id), 1)
    setEmail(auth.email)
    setPassword(auth.password)
    setEditMode(false)
  }

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

  const copyTarget = async (target: HTMLInputElement) => {
    await navigator.clipboard.writeText(target.value);
    closeSnackbar()
    enqueueSnackbar("Copied to clipboard", { variant: "success" })
  }

  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);

  useEffect(() => {
    setEmail(auth.email)
    setPassword(auth.password)
  }, [])

  return (
    <div className={`${deletedAuths?.includes(auth._id) ? "hidden" : "flex"} max-sm:flex-col border gap-4 border-gray-300 rounded-xl p-4 ${forceCloseAttempted && editOpened?.current.includes(auth._id) ? "ring-2 ring-red-600" : ""}`}>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex max-sm:flex-col sm:gap-5 justify-between sm:items-center relative">
          <label htmlFor={`${auth._id}`} className="text-gray-600 max-sm:font-bold">Email: </label>
          <input onChange={(e) => {setEmail(e.target.value); setForceCloseAttempted(false); setErrorEmail(false) }} readOnly={!editMode} ref={emailField} className={`w-full ${editMode && "text-black"} ${errorEmail && "ring-2 ring-red-600"} pr-[35px] bg-gray-100 border-gray-300 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600`} type="text" name="email" id={`${auth._id}`} value={email} />
          <div className="flex gap-4 absolute right-0 m-[7px] bottom-0">
            {!editMode && <DotLottieReact onClick={()=>{if (emailField.current) copyTarget(emailField.current)}} title="Copy" className="h-[28px] w-[28px] cursor-pointer" dotLottieRefCallback={dotLottieRefCallbackIconCopyEmail} data={copy} loop={false} autoplay={false} onMouseEnter={() => iconCopyEmail?.play()} />}
            {editMode && <DotLottieReact className="h-[28px] w-[28px]" data={copyDisabled} loop={false} autoplay={false} />}
          </div>
        </div>

        <div className="flex max-sm:flex-col sm:gap-5 justify-between sm:items-center relative">
          <label htmlFor={`${auth._id}1`} className="text-gray-600 max-sm:font-bold">Password: </label>
          <input onChange={(e) => {setPassword(e.target.value); setForceCloseAttempted(false); setErrorPassword(false) }}  readOnly={!editMode} ref={passwordField} className={`w-full ${editMode && "text-black pr-[35px]"} ${errorPassword && "ring-2 ring-red-600"} pr-[86px] bg-gray-100 border-gray-300 px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-600`} type="password" name="password" id={`${auth._id}1`} value={password} />
          <div className="flex gap-4 absolute right-0 m-[7px] bottom-0">
            <DotLottieReact speed={4} onClick={handleShowHidePassword} title="Show/Hide" className="h-[28px] w-[28px] cursor-pointer" dotLottieRefCallback={dotLottieRefCallbackShowHideIcon} data={eyeCross} autoplay={false} loop={false} />
            {!editMode && <DotLottieReact onClick={()=>{if (passwordField.current) copyTarget(passwordField.current)}} title="Copy" className="h-[28px] w-[28px] cursor-pointer" dotLottieRefCallback={dotLottieRefCallbackIconCopyPassword} data={copy} loop={false} autoplay={false} onMouseEnter={() => iconCopyPassword?.play()} />}
            {editMode && <DotLottieReact className="h-[28px] w-[28px]" data={copyDisabled} loop={false} autoplay={false} />}
          </div>
        </div>
      </div>
      <div className="gap-4 grid max-sm:grid-flow-col sm:grid-cols-2 place-items-center p-2 sm:p-4 border border-gray-300 rounded-xl">
        {!editMode && <DotLottieReact onClick={enterEditMode} title="Edit" className="h-[28px] w-[28px] cursor-pointer" dotLottieRefCallback={dotLottieRefCallbackIconEdit} data={edit} loop={false} autoplay={false} onMouseEnter={() => iconEdit?.play()} />}
        {!editMode && <DotLottieReact onClick={() => {if (deleteAuth) deleteAuth(auth._id) }} title="Delete" className="h-[28px] w-[28px] cursor-pointer" dotLottieRefCallback={dotLottieRefCallbackIconDelete} data={bin} loop={false} autoplay={false} onMouseEnter={() => iconDelete?.play()} />}
        {!editMode && <DotLottieReact title="Save" className="h-[28px] w-[28px]" data={tickDisabled} loop={false} autoplay={false} />}
        {!editMode && <DotLottieReact onClick={cancelEditMode} title="Cancel" className="h-[28px] w-[28px]" data={crossDisabled} loop={false} autoplay={false} />}

        {editMode && <DotLottieReact className="h-[28px] w-[28px]" data={editDisabled} loop={false} autoplay={false} />}
        {editMode && <DotLottieReact className="h-[28px] w-[28px]" data={binDisabled} loop={false} autoplay={false} />}
        {editMode && <DotLottieReact onClick={() => {saveAndCancelEditMode(); enqueueSnackbar("Password saved successfully", { variant: "success" })}} title="Save" className="h-[28px] w-[28px] cursor-pointer" dotLottieRefCallback={dotLottieRefCallbackIconTick} data={tick} loop={false} autoplay={false} onMouseEnter={() => iconTick?.play()} />}
        {editMode && <DotLottieReact onClick={cancelEditMode} title="Cancel" className="h-[28px] w-[28px] cursor-pointer" dotLottieRefCallback={dotLottieRefCallbackIconCross} data={cross} loop={false} autoplay={false} onMouseEnter={() => iconCross?.play()} />}
      </div>
    </div>
  )
})

export default ShowAuth