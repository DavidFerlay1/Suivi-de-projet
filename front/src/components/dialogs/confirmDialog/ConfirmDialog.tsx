import Dialog from "../dialog/Dialog";
import React from "react"
import { useTranslation } from "react-i18next"
import { ReactNode } from "react";
import './confirmDialog.scss';

type ConfirmDialogProps = {
    onConfirm: Function,
    onCancel?: Function,
    yesLabel?: string,
    noLabel?: string,
    isOpen: boolean,
    setIsOpen: Function,
    isModal: boolean,
    title: string,
    children: ReactNode|ReactNode[],
    beforeClose?: Function
}


const ConfirmDialog = ({onConfirm, onCancel, yesLabel, noLabel, isOpen, setIsOpen, isModal, title, children, beforeClose}: ConfirmDialogProps) => {

    const {t} = useTranslation();

    const onYesClick = async () => {
        await onConfirm();
        setIsOpen(false);
    }

    const onNoClick = async () => {
        onCancel && await onCancel();
        setIsOpen(false);
    }

    const renderFooter = () => (
        <div className="dialog-button-group">
            <button className="terciary" onClick={onYesClick}>{yesLabel || t('misc.confirm')}</button>
            <button onClick={onNoClick}>{noLabel || t('misc.cancel')}</button>
        </div>
    )

    return (
        <Dialog beforeClose={beforeClose} renderFooter={renderFooter} isModal={isModal} isOpen={isOpen} setIsOpen={setIsOpen} title={title}>
            {children}
        </Dialog>
    )
}

export default ConfirmDialog;