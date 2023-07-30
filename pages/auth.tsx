import { useCallback, useState } from "react";
import axios from "axios";
import { signIn } from "next-auth/react";
import * as yup from "yup";

import { Box, useMediaQuery, Typography } from "@mui/material";
import { Form, Formik, Field, FormikHelpers } from "formik";
import Dropzone from "react-dropzone";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: null,
};
interface LoginForm {
  email: string;
  password: string;
}
interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  location: string;
  occupation: string;
  picture: File;
}
const Auth = () => {
  const [variant, setVariant] = useState("login");
  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "login" ? "register" : "login"
    );
  }, []);
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const login = async (
    values: LoginForm,
    onSubmitProps: FormikHelpers<{ email: string; password: string }>
  ) => {
    try {
      await signIn("credentials", {
        email: values.email,
        password: values.password,

        callbackUrl: "/",
      });
      onSubmitProps.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const register = async (
    values: RegisterForm,
    onSubmitProps: FormikHelpers<RegisterForm>
  ) => {
    try {
      const formData = new FormData();
      for (let value in values) {
        formData.append(value, values[value as keyof typeof values]);
      }
      formData.append("picturePath", values.picture.name);
      await axios.post("/api/register", {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        location: values.location,
        occupation: values.occupation,
        picturePath: values.picture.name,
      });

      onSubmitProps.resetForm();

    } catch (error) {
      console.log(error);
    }
  };

  const handleRegisterFormSubmit = async (
    values: RegisterForm,
    onSubmitProps: FormikHelpers<RegisterForm>
  ) => {
    await register(values, onSubmitProps);
  };
  const handleLoginFormSubmit = async (
    values: LoginForm,
    onSubmitProps: FormikHelpers<{ email: string; password: string }>
  ) => {
    await login(values, onSubmitProps);
  };

  return (
    <div className="bg-gray-200 h-screen w-screen flex items-center justify-center">
      <div className="w-[70%] h-[70%] flex">
        <div className="flex-[1] flex flex-col justify-center">
          <h3 className="text-[50px] font-extrabold text-[#1775ee] mb-2.5">
            Lovesocial
          </h3>
          <span className="text-2xl">
            Connect with friends and the world around you on Lovesocial.
          </span>
        </div>
        <div className="flex-[1] flex flex-col justify-center ml-20">
          <h2 className="text-white text-4xl mb-8 font-semibold">
            {variant === "login" ? "Sign in" : "Register"}
          </h2>
          <div className="flex flex-col gap-4">
            {variant === "register" ? (
              <Formik
                onSubmit={handleRegisterFormSubmit}
                // @ts-ignore
                initialValues={initialValuesRegister}
                validationSchema={registerSchema}
              >
                {({ values, handleSubmit, setFieldValue }) => (
                  <Form
                    className="flex-[1] flex flex-col justify-center"
                    onSubmit={handleSubmit}
                  >
                    <div className="bg-[white] flex flex-col justify-between p-5 rounded-[10px]">
                      <Field
                        placeholder="First name"
                        name="firstName"
                        className="min-h-[50px] border text-lg pl-5 rounded-[10px] border-solid border-[gray] mb-5"
                        value={values.firstName || ""}
                      />
                      <Field
                        placeholder="Last name"
                        name="lastName"
                        className="min-h-[50px] border text-lg pl-5 rounded-[10px] border-solid border-[gray] mb-5"
                        value={values.lastName || ""}
                      />
                      <Field
                        placeholder="Email"
                        name="email"
                        className="min-h-[50px] border text-lg pl-5 rounded-[10px] border-solid border-[gray] mb-5"
                        value={values.email || ""}
                      />
                      <Field
                        placeholder="Password"
                        name="password"
                        className="min-h-[50px] border text-lg pl-5 rounded-[10px] border-solid border-[gray] mb-5"
                        value={values.password || ""}
                      />
                      <Field
                        placeholder="Location"
                        name="location"
                        className="min-h-[50px] border text-lg pl-5 rounded-[10px] border-solid border-[gray] mb-5"
                        value={values.location || ""}
                      />
                      <Field
                        placeholder="Occupation"
                        name="occupation"
                        className="min-h-[50px] border text-lg pl-5 rounded-[10px] border-solid border-[gray]"
                        value={values.occupation || ""}
                      />
                      <Box gridColumn="span 4" borderRadius="5px" p="1rem">
                        <Dropzone
                          // @ts-ignore
                          acceptedFiles=".jpg,.jpeg,.png"
                          multiple={false}
                          onDrop={(acceptedFiles) =>
                            setFieldValue("picture", acceptedFiles[0])
                          }
                        >
                          {({ getRootProps, getInputProps }) => (
                            <Box
                              {...getRootProps()}
                              p="1rem"
                              sx={{ "&:hover": { cursor: "pointer" } }}
                            >
                              <input {...getInputProps()} />
                              {!values.picture ? (
                                <p>Add Picture Here</p>
                              ) : (
                                <Typography>{values.picture.name}</Typography>
                              )}
                            </Box>
                          )}
                        </Dropzone>
                      </Box>
                    </div>

                    <button
                      type="submit"
                      className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition"
                    >
                      SignUp
                    </button>
                  </Form>
                )}
              </Formik>
            ) : (
              <Formik
                initialValues={{ email: "", password: "" }}
                onSubmit={handleLoginFormSubmit}
              >
                {({ values, handleSubmit }) => (
                  <Form
                    className="flex-[1] flex flex-col justify-center"
                    onSubmit={handleSubmit}
                  >
                    <div className="bg-[white] flex flex-col justify-between p-5 rounded-[10px]">
                      <Field
                        placeholder="Email"
                        value={values.email}
                        name="email"
                        className="min-h-[50px] border text-lg pl-5 rounded-[10px] border-solid border-[gray] mb-5"
                      />
                      <Field
                        placeholder="Password"
                        value={values.password}
                        name="password"
                        className="min-h-[50px] border text-lg pl-5 rounded-[10px] border-solid border-[gray] mb-5"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-red-600 py-3 text-white rounded-md w-full mt-10 hover:bg-red-700 transition"
                    >
                      Login
                    </button>
                  </Form>
                )}
              </Formik>
            )}
          </div>

          <p className="text-neutral-500 mt-5">
            {variant === "login"
              ? "First time using Lovesocial?"
              : "Already have an account?"}
            <span
              onClick={toggleVariant}
              className="text-white ml-1 hover:underline cursor-pointer"
            >
              {variant === "login" ? "Create an account" : "Login"}
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
