import { Suspense } from "react";
import LoginForm from "../../components/LoginForm";
import React from "react";

const NewLogin = async () => {

    const signinForm = {
        username: "",
        password: "",
    };
    return <Suspense><LoginForm formId="login-form" loginForm={signinForm}/></Suspense>
};

export default NewLogin;