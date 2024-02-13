import { Suspense } from "react";
import RegistrationForm from "../../../components/RegistrationForm";

const NewUser = () => {
    const userForm = {
        username: "",
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    };
    return <Suspense><RegistrationForm formId="add-user-form" registrationForm={userForm}/></Suspense>
};

export default NewUser;