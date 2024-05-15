import React, { ChangeEvent, FormEvent, FormEventHandler, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import useApi from "../../../hooks/useApi"
import { useNavigate } from "react-router"

type ResetPasswordFormProps = {
    token: string|undefined
}

const ResetPasswordForm = ({token}: ResetPasswordFormProps) => {

    const {t} = useTranslation();
    const {authApi} = useApi();
    const navigate = useNavigate();

    const [values, setValues] = useState({
        password: {
            first: '',
            second: ''
        }
    })

    const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            password: {
               ...values.password,
               [e.target.name]: e.target.value 
            }
        })
    }

    const canSubmit = useMemo(() => {
        console.log(values.password.first && values.password.second && values.password.first === values.password.second)
        return values.password.first && values.password.second && values.password.first === values.password.second;
    }, [values])

    const onSubmit: FormEventHandler<HTMLFormElement> = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const body = {...values, token};
        authApi.resetPassword(body).then(res => navigate('/')).catch(e => console.log(e.response))
    }

    return token && (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>{t('misc.password')}</label>
                <input type="password" value={values.password.first} onChange={onEdit} name="first" />
            </div>
            <div className="form-group">
                <label>{t('misc.confirmPassword')}</label>
                <input type="password" value={values.password.second} onChange={onEdit} name="second" />
            </div>
            <button type="submit" disabled={!canSubmit}>{t('misc.confirm')}</button>
        </form>
    )
}

export default ResetPasswordForm;