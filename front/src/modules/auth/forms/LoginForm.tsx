import React, { ChangeEvent, FormEvent, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router"
import { isEmail } from "../../../services/Utils"
import useApi from "../../../hooks/useApi"
import useAuth from "../../../hooks/useAuth"
import Form, { CatchableField } from "../../../components/Form/Form"
const LoginForm = () => {

    const {t} = useTranslation();
    const navigate = useNavigate();
    const {authApi} = useApi();
    const {storeTokens} = useAuth();

    const [values, setValues] = useState({
        username: '',
        password: ''
    })

    const [errors, setErrors] = useState<object>();

    const canSubmit = useMemo(() => {
        return isEmail(values.username) && values.password;
    }, [values])

    const onEdit = (e: ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value
        })
    }

    const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const tokens = (await authApi.login(values)).data;
            storeTokens(tokens);
            navigate('/');
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <Form onSubmit={onSubmit}>
            <CatchableField label={t('personal.username')}>
                <input className="field" value={values.username} onChange={onEdit} name="username" />
            </CatchableField>
            <CatchableField label={t('personal.password')} errors={errors}>
                <input type="password" className="field" value={values.password} onChange={onEdit} name="password" />
            </CatchableField>      
        </Form>
    )
}

export default LoginForm;