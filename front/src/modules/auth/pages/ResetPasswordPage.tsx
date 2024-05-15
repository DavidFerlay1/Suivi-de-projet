import React from "react";
import { useParams } from "react-router"
import ResetPasswordForm from "../forms/ResetPasswordForm";

const ResetPasswordPage = () => {
    const {token} = useParams(); 

    return (
        <ResetPasswordForm token={token} />
    )
}

export default ResetPasswordPage;