import React, { ReactNode, useCallback, useState } from "react"
import Dialog from "../../dialog/Dialog";

type ToggleDialogProps = {
    children: ReactNode|ReactNode[],
    title: string,
    buttonText?: string,
    isModal: boolean,
    className?: string,
    confirmClose?: boolean,
    buttonClassName?: string,
    icon?: any
}

const ToggleDialog = ({children, title, buttonText, isModal, className, confirmClose, buttonClassName, icon}: ToggleDialogProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button className={buttonClassName ?? ' ' + (icon && 'iconed')} onClick={() => setOpen(!open)}>{icon}{buttonText || title}</button>
            <Dialog confirmClose={confirmClose} title={title} className={className} isOpen={open} setIsOpen={setOpen} isModal={isModal}>
                {children}
            </Dialog>
        </>
    )
}

export default ToggleDialog;