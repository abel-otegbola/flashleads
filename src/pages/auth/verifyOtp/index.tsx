import { Formik } from "formik";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../../components/button/Button";
import { verifyOtpSchema } from "../../../schema/authSchema";
import LoadingIcon from "../../../assets/icons/loadingIcon";
import AuthOverlay from "../../../components/authOverlay/authOverlay";
import { AuthContext } from "../../../contexts/AuthContextValue";
import LineCircleIcon from "../../../assets/icons/lineCircle";
import OtpInput from 'react-otp-input';

export default function VerifyOtp() {
  const { verifyOtp, loading } = useContext(AuthContext);
  const [otp, setOtp] = useState("");

  return (
    <div className="h-screen flex justify-between">

      <div className="flex items-center justify-center 2xl:w-[54.375%] xl:w-[55%] md:w-[55%] h-full w-full md:px-0 px-6">
        <div className="2xl:w-[600px] sm:w-[460px] py-[15%] md:mx-0 mx-auto h-full w-full">
          <div className="relative flex flex-col justify-center 2xl:gap-12 gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-[24px] text-center">Verify OTP</h1>
              <p className="text-[#7C7E7E] font-medium text-center">Enter the 6-digit code sent to your email</p>
            </div>

            <div className="flex items-center gap-4 w-full">
              <LineCircleIcon className="flex-1 "/>
              <span className="text-gray-400 rounded font-medium border border-gray-100 p-4 md:px-[15%] leading-[12px] py-2 text-nowrap text-[12px]">Verify Code</span>
              <LineCircleIcon className="flex-1 rotate-180" />
            </div>


            <Formik
              initialValues={{ otp: "" }}
              validationSchema={verifyOtpSchema}
              onSubmit={(values, { setSubmitting }) => {
                verifyOtp(values.otp);
                setSubmitting(false);
              }}
            >
              {({ values, errors, touched, setFieldValue, handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit} className="flex flex-col w-full gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Enter OTP</label>
                    <OtpInput
                      value={otp}
                      onChange={(value: string) => {
                        setOtp(value);
                        setFieldValue("otp", value);
                      }}
                      numInputs={6}
                      renderSeparator={<span className="w-2"></span>}
                      renderInput={(props) => <input {...props} />}
                      inputStyle={{
                        width: "100%",
                        height: "56px",
                        fontSize: "20px",
                        borderRadius: "8px",
                        border: "1px solid #E5E7EB",
                        outline: "none",
                        transition: "all 0.2s",
                      }}
                      containerStyle={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "8px"
                      }}
                      shouldAutoFocus
                      inputType="tel"
                    />
                    {touched.otp && errors.otp && (
                      <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full mt-4">
                    {isSubmitting || loading ? <LoadingIcon color="white" className="animate-spin w-[20px]" /> : "Verify Code"}
                  </Button>
                </form>

              )}
            </Formik>

            <div className="flex justify-center gap-2 items-center font-medium">
              <span className="text-[#7C7E7E]">Didn't receive code? </span>
              <Link to="/forgot-password" className="text-primary">Resend Code</Link>
            </div>

            <div className="flex justify-center gap-4 items-center mb-8">
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
      <AuthOverlay />

    </div>
  );
}
