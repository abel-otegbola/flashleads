"use client";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "../../components/sidebar/sidebar";
import LeadDetails from "./leads/LeadDetails";
import { Formik } from "formik";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContextValue";
import Feeds from "./leads";
import Dashboardpage from "./dashboard";
import SearchBar from "../../components/search/searchBar";
import { Bell } from "@solar-icons/react";
import { AuthCTA } from "../../components/authCTA/AuthCTA";
import Profile from "./profile";
import Settings from "./settings";
import Notifications from "./notifications";
import CaseStudyDetails from "./case-studies/caseStudyDetails";
import CaseStudies from "./case-studies";
import NewCaseStudy from "./case-studies/new";

function AccountPages() {
    const { user } = useContext(AuthContext);
    
    // If not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }
  
    return (
        <div className="min-h-[400px] flex justify-between bg-background bg-cover">
            <Sidebar />
            <div className="flex flex-col flex-1">
                <div className="flex p-3 md:px-6 px-4 sm:pr-4 items-center justify-end bg-background dark:bg-dark-bg border-b border-gray/[0.1] sticky top-0 z-[2]">
                    
                    <div className="flex md:gap-6 gap-4 items-center">
                        <Formik
                            initialValues={{ search: "" }}
                            onSubmit={(values, { setSubmitting }) => {
                                console.log(values)
                                setSubmitting(false);
                            }}
                        >
                            {({ handleSubmit }) => (
                            <form onSubmit={handleSubmit} className="bg-bg-gray-100 dark:bg-dark-bg-secondary rounded-[10px]">
                                <SearchBar />
                            </form>
                            )
                        }
                        </Formik>
                        <Link to={"/account/notifications"} className="relative opacity-50 duration-300">
                            <Bell size={22} color="currentColor"/>
                        </Link>
                        <AuthCTA user={user} />
                    </div>
                </div>
                <Routes>
                    <Route path="/" element={<Navigate to={"/account/dashboard"} />} />
                    <Route path="/dashboard" element={<Dashboardpage />} />
                    <Route path="/leads" element={<Feeds />} />
                    <Route path="/leads/:id" element={<LeadDetails />} />
                    <Route path="/business/:id" element={<LeadDetails />} />
                    <Route path="/case-studies" element={<CaseStudies />} />
                    <Route path="/case-studies/new" element={<NewCaseStudy />} />
                    <Route path="/case-studies/:id/edit" element={<NewCaseStudy />} />
                    <Route path="/case-studies/:id" element={<CaseStudyDetails />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/notifications" element={<Notifications />} />
                </Routes>
            </div>
        </div>
    )
}

export default AccountPages
