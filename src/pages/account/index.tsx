"use client";
import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import { Formik } from "formik";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContextValue";
import Leads from "./leads";
import Clients from "./clients";
import Dashboardpage from "./dashboard";
import SearchBar from "../../components/search/searchBar";
import { Bell } from "@solar-icons/react";
import { AltArrowRight } from "@solar-icons/react/ssr";

function AccountPages() {
    const { user } = useContext(AuthContext);
    const pathname = useLocation().pathname;

    // If not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/auth/login" replace />;
     }
  return (
    <div className="min-h-[400px] flex justify-between bg-bg-gray-100 dark:bg-dark/[0.6]">
        <Sidebar />
        <div className="flex flex-col flex-1">
            <div className="flex p-3 px-4 sm:pr-4 pr-[66px] items-center justify-between bg-white dark:bg-dark-bg border-b border-gray-500/[0.1] md:static sticky top-0">
                <div className="flex gap-1 capitalize font-semibold items-center">
                    {pathname.replace("/account/", "").split("/").map((segment, index, arr) => (
                        <span key={index} className="flex items-center gap-1">
                            {segment}
                            {index < arr.length - 1 && <AltArrowRight size={16} />}
                        </span>
                    ))}
                </div>
                
                {/* <LogoIcon className="md:hidden"/> */}

                <div className="flex gap-6 items-center">
                    <Link to={"/account/notifications"} className="relative text-gray-200 hover:text-gray-400 duration-300">
                        <Bell size={20} color="currentColor"/>
                    </Link>
                    <Formik
                        initialValues={{ search: "" }}
                        onSubmit={(values, { setSubmitting }) => {
                            console.log(values)
                            setSubmitting(false);
                        }}
                    >
                        {({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="bg-bg-gray-100 dark:bg-dark-bg-secondary rounded-[10px] md:block hidden">
                            <SearchBar />
                        </form>
                        )
                    }
                    </Formik>
                    <Link to={"/account"} className="flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-semibold outline-2 outline-offset-2 outline-primary/[0.2]">{user?.email?.charAt(0).toUpperCase()}</span>
                        <div className="flex-col gap-[2px] sm:flex hidden">
                            <span className="text-sm capitalize">{user?.firstname || user?.email?.split('@')[0]}</span>
                            <span className="text-xs opacity-[0.7]">{user?.email}</span>
                        </div>
                    </Link>
                </div>
            </div>
            <Routes>
                <Route path="/" element={<Navigate to={"/account/dashboard"} />} />
                <Route path="/dashboard" element={<Dashboardpage />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/clients" element={<Clients />} />
            </Routes>
        </div>
    </div>
  )
}

export default AccountPages
