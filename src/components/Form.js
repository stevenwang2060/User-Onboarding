import React, { useState, useEffect } from "react";
import { withFormik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";

function UserForm({ values, errors, touched, status }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        console.log('status has changed!', status);
        status && setUsers(users => [...users, status])
    }, [status]);

    return (
        <div className="container">
            <Form>
                <h1>New User</h1>
                <div>
                    <p>
                        <label htmlFor="name">Name: </label>
                        {touched.name && errors.name && <span style={{ color: "red" }}>{errors.name}</span>}
                        <Field type="text" name="name" placeholder="Name" />
                    </p>
                </div>
                <div>
                    <p>
                        <label htmlFor="email">Email: </label>
                        {touched.email && errors.email && <span style={{ color: "red" }}>{errors.email}</span>}
                        <Field type="email" name="email" placeholder="Email" />
                    </p>
                </div>
                <div>
                    <p>
                        <label htmlFor="Password">Password: </label>
                        {touched.password && errors.password && <span style={{ color: "red" }}>{errors.password}</span>}
                        <Field type="password" name="password" placeholder="Enter Password (must have minimum 8 characters)" />
                    </p>
                </div>
                <div>
                    <p>
                        <label htmlFor="tos">
                            <Field type="checkbox" name="tos" checked={values.tos} />
                            Accept Terms Of Service
                </label>
                    </p>
                </div>
                <button type="submit">Submit!</button>
            </Form>
            {users.map(data => (
                <ul key={data.id}>
                    <li>Name: {data.name}</li>
                    <li>Email: {data.email}</li>
                    <li>Password: {data.password}</li>
                    <li>TOS: {String(data.tos)}</li>
                </ul>
            ))}
        </div>
    )
}

const FormikUserForm = withFormik({
    mapPropsToValues({ name, email, password, tos }) {
        return {
            name: name || "",
            email: email || "",
            password: password || "",
            tos: tos || false,
        };
    },

    validationSchema: Yup.object().shape({
        name: Yup.string()
            .min(3)
            .required("Name is required "),
        email: Yup.string()
            .email("Email not valid")
            .required("Email is required "),
        password: Yup.string()
            .min(8, "Password must be 8 characters or longer")
            .required("Password is required "),
    }),

    handleSubmit(values, { resetForm, setSubmitting, setErrors, setStatus }) {
        console.log(values);
        if (values.email === "waffle@syrup.com") {
            setErrors({ email: "That email is already taken" });
        } else {
            axios
                .post("https://reqres.in/api/users/", values)
                .then(res => {
                    console.log('success', res)
                    setStatus(res.data);
                    resetForm();
                    setSubmitting(false);
                })
                .catch(err => {
                    console.log(err);
                    setSubmitting(false);
                });
        }
    }
})(UserForm);

export default FormikUserForm;