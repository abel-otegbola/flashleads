import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/auth/login"
import AuthProvider from "./contexts/AuthContext"
import LeadsProvider from "./contexts/LeadsContext"
import ClientsProvider from "./contexts/ClientsContext"
import Signup from "./pages/auth/signup"
import ForgotPassword from "./pages/auth/forgotPassword"
import VerifyOtp from "./pages/auth/verifyOtp"
import ResetPassword from "./pages/auth/resetPassword"
import AccountPages from "./pages/account"

function App() {

  return (
    <div className="text-[14px] 2xl:text-[18px] tracking-[5%] leading-[24px]">
      <BrowserRouter>
      <AuthProvider>
        <LeadsProvider>
          <ClientsProvider>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/account/*" element={<AccountPages />} />
            </Routes>
          </ClientsProvider>
        </LeadsProvider>
      </AuthProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
