import { Formik } from "formik";
import { useContext } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/button/Button";
import Input from "../../../components/input/Input";
import { signupSchema } from "../../../schema/authSchema";
import LoadingIcon from "../../../assets/icons/loadingIcon";
import AuthOverlay from "../../../components/authOverlay/authOverlay";
import { AuthContext } from "../../../contexts/AuthContextValue";
import { Letter, Lock, User, Buildings } from "@solar-icons/react";

export default function Signup() {
  const { signUp, loading } = useContext(AuthContext);

  return (
    <div className="h-screen overflow-y-auto flex sm:items-center justify-between">
      <AuthOverlay />

      <div className="flex items-center justify-center 2xl:w-[54.375%] xl:w-[55%] md:w-[55%] h-full w-full md-px-0 px-6">
        <div className="2xl:w-[400px] sm:w-[360px] pt-[25%] md:mx-0 mx-auto w-full">
          <div className="relative flex flex-col justify-center 2xl:gap-12 gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-[24px]">Create Account</h1>
              <p className="text-[#7C7E7E] font-medium">Create your free account to start finding high-quality leads and sending smarter cold emails.</p>
            </div>

            <Formik
              initialValues={{ fullname: "", email: "", companyName: "", password: "" }}
              validationSchema={signupSchema}
              onSubmit={(values, { setSubmitting }) => {
                signUp({
                  email: values.email,
                  password: values.password,
                  fullname: values.fullname,
                  role: "freelancer",
                  storename: values.companyName
                });
                setSubmitting(false);
              }}
            >
              {({ values, errors, touched, handleChange, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
                  <Input
                    name="fullname"
                    value={values.fullname}
                    onChange={handleChange}
                    type="text"
                    lefticon={<User weight="BoldDuotone" size={20} color="currentColor" />}
                    error={touched.fullname ? errors.fullname : ""}
                    label="Full Name"
                  />
                  <Input
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    type="email"
                    lefticon={<Letter weight="BoldDuotone" size={20} color="currentColor" />}
                    error={touched.email ? errors.email : ""}
                    label="Work Email"
                  />
                  <Input
                    name="companyName"
                    value={values.companyName}
                    onChange={handleChange}
                    type="text"
                    lefticon={<Buildings weight="BoldDuotone" size={20} color="currentColor" />}
                    error={touched.companyName ? errors.companyName : ""}
                    label="Company Name"
                  />
                  <Input
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    type="password"
                    lefticon={<Lock weight="BoldDuotone" size={20} color="currentColor" />}
                    error={touched.password ? errors.password : ""}
                    label="Password"
                  />
                  <Button type="submit" className="w-full mt-4">
                    {isSubmitting || loading ? <LoadingIcon color="white" className="animate-spin w-[20px]" /> : "Create Account"}
                  </Button>
                </form>
              )}
            </Formik>

            <div className="">
              <span className="text-[#7C7E7E]">Already have an account? </span>
              <Link to="/" className="text-primary font-medium">Log in</Link>
            </div>

            <div className="flex justify-between gap-2 items-center mb-8">
              <Link to="/termsofuse" className="text-gray-200 hover:underline">
                Terms of Use
              </Link>
              <Link to="/privacypolicy" className="text-gray-200 hover:underline">
                Privacy Policy
              </Link>
              <Link to="/privacysettings" className="text-gray-200 hover:underline">
                Privacy Settings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
