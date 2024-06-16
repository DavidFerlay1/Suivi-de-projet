import React, { FormEvent, FormEventHandler, ReactNode } from "react"

type FormProps= {
    children: ReactNode|ReactNode[],
    canSubmit?: boolean,
    onSubmit: FormEventHandler<HTMLFormElement>,
    submitText?: string
}

type CatchableFieldProps = {
    label: string,
    children: ReactNode|ReactNode[],
    errors?: object
}

export const CatchableField = ({label, children, errors}: CatchableFieldProps) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            {children}
            {errors && Object.keys(errors).map((error, index) => <p className="danger" key={index}>{error}</p>)}
        </div>
    )
}

const Form = ({children, canSubmit = true, onSubmit, submitText = 'Submit'}: FormProps) => {

    const submitBehavior = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(e);
    }

    return (
        <form onSubmit={submitBehavior}>
            {children}
            <div style={{display: 'flex', justifyContent: 'center', marginBottom: '10px'}}>
                <button disabled={!canSubmit}>{submitText}</button>
            </div>
        </form>
    )
}

export default Form;