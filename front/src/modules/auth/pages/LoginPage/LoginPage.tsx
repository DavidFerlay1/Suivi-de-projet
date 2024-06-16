import React from "react"
import AnonymousOnlyLayout from "@components/layouts/security/AnonymousOnlyLayout"
import LoginForm from "../../forms/LoginForm"
import './loginPage.scss'
import ToggleDialog from '@components/dialogs/toggles/toggleDialog/ToggleDialog'
import ResetPasswordRequestForm from "../../forms/ResetPasswordRequestForm"
import { useTranslation } from "react-i18next"

const LoginPage = () => {

    const {t} = useTranslation();

    return (
        <AnonymousOnlyLayout>
            <div className="page">
                <LoginForm />
                <ToggleDialog title={t('misc.resetPassword')} buttonClassName="terciary" isModal={false}>
                    <ResetPasswordRequestForm />
                </ToggleDialog>
            </div>
            
        </AnonymousOnlyLayout>
    )
}

export default LoginPage;