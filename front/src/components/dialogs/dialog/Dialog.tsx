import React, { ReactNode, useEffect, useState } from "react"
import './dialog.scss';
import { CiBoxes } from "react-icons/ci";
import { IoMdCloseCircle, IoMdCloseCircleOutline, IoMdTime } from "react-icons/io";
import { createPortal } from 'react-dom';
import ConfirmDialog from "../confirmDialog/ConfirmDialog";
import { useTranslation } from "react-i18next";
import { LuCross, LuX } from "react-icons/lu";

type DialogProps = {
    isOpen: boolean,
    children: ReactNode|ReactNode[],
    title: string,
    isModal: boolean,
    setIsOpen: Function,
    renderFooter?: Function,
    className?: string,
    confirmClose?: boolean,
    confirmCloseMessage?: string,
    beforeClose?: Function
}

const Dialog = ({setIsOpen, isOpen, children, title, isModal, renderFooter, className, confirmClose = false, confirmCloseMessage, beforeClose}: DialogProps) => {

    const [confirmCloseOpen, setConfirmCloseOpen] = useState(false);
    const {t} = useTranslation();

    const closePopup = async (checkModal = false) => {
        if(!(checkModal && isModal)) {
            if(confirmClose) {
                setConfirmCloseOpen(true);
            } else {
                if(beforeClose)
                    await beforeClose();
                setIsOpen(false);
            }
        }
    }

    return isOpen && (
            createPortal(
                    <>
                        <div className="dialog-overlay" onClick={() => closePopup(true)}>
                            <div className={`dialog ${className ?? ''}`} onClick={e => e.stopPropagation()}>
                                <div className="dialog-header">
                                    <h3>
                                        {title}
                                    </h3>
                                    <button className="danger icon-button" onClick={() => closePopup(false)}><LuX /></button>
                                </div>
                                <div className="dialog-body">
                                    {children}
                                </div>
                                {renderFooter && <div className="dialog-footer">{renderFooter()}</div>}
                            </div>
                            
                            {confirmCloseOpen && 
                                <ConfirmDialog beforeClose={beforeClose} title={t('misc.alert')} isOpen={confirmCloseOpen} onConfirm={() =>  setIsOpen(false)} isModal={true} setIsOpen={setConfirmCloseOpen}>
                                    {confirmCloseMessage || t('confirmDialogs.editProject')}
                                </ConfirmDialog>
                            }
                        </div>
                    </>
                , document.body
            )
    )
}

export default Dialog;