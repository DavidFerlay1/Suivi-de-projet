import React,{ FormEvent, useMemo, useState } from "react"
import { useTranslation } from "react-i18next";
import {isEmail} from '../../../services/Utils';
import useApi from "../../../hooks/useApi";

const ResetPasswordRequestForm = () => {

    const {t} = useTranslation();
    const {authApi} = useApi();

    const [username, setUsername] = useState('');

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        authApi.resetPasswordRequest(username).then(res => {
            console.log(res.data);
        }).catch(e => {
            console.log(e.response);
        })
    }

    const canSubmit = useMemo(() => {
        return isEmail(username);
    }, [username])

    return (
        <form onSubmit={onSubmit}>
            <div className="form-group">
                <label>{t('misc.email')}</label>
                <input className="field" onChange={e => setUsername(e.target.value)} />
            </div>
            <button disabled={!canSubmit}>{t('misc.resetPassword')}</button>
        </form>
    )
}

export default ResetPasswordRequestForm;