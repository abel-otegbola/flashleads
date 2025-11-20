"use client";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import { Formik } from "formik";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContextValue";
import Dashboard from "./dashboard";
import Leads from "./leads";
import Clients from "./clients";

function AccountPages() {
    const { user } = useContext(AuthContext);

    // If not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/auth/login" replace />;
     }
  return (
    <div className="min-h-[400px] flex justify-between bg-bg-gray-100 dark:bg-dark/[0.6]">
        <Sidebar />
        <div className="flex flex-col flex-1 gap-4">
            <div className="flex p-4 sm:pr-4 pr-18 items-center justify-between bg-white dark:bg-dark-bg border-b border-gray-500/[0.1] md:static sticky top-0">
                <Formik
                    initialValues={{ search: "" }}
                    onSubmit={(values, { setSubmitting }) => {
                        console.log(values)
                        setSubmitting(false);
                    }}
                >
                    {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="bg-bg-gray-100 dark:bg-dark-bg-secondary rounded-[10px] md:block hidden">
                        {/* <SearchBar /> */}
                    </form>
                    )
                }
                </Formik>
                {/* <LogoIcon className="md:hidden"/> */}

                <div className="flex gap-6 items-center">
                    <Link to={"/account"} className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold">{user?.email?.charAt(0).toUpperCase()}</Link>
                </div>
            </div>
            <Routes>
                <Route path="/" element={<Navigate to={"/account/dashboard"} />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/clients" element={<Clients />} />
            </Routes>
        </div>
    </div>
  )
}

export default AccountPages
