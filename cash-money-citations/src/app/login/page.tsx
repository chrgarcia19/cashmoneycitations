import { Suspense } from "react";
import LoginForm from "../../components/LoginForm";
import { getServerSession } from 'next-auth';
import { getProviders } from 'next-auth/react'

const NewLogin = async () => {
    const session = await getServerSession();
    // if (!session) {
    //     return <div>Session is not available</div>

    // }

    // const providers = await getProviders();

    // if (!providers) {
    //     return <div>Sign in not available</div>
    // }

    const signinForm = {
        username: "",
        password: "",
    };
    return <Suspense><LoginForm formId="login-form" loginForm={signinForm}/></Suspense>
};

export default NewLogin;