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
import Homepage from "./pages/static/home/home"
import Integrations from "./pages/static/integrations"
import Pricing from "./pages/static/pricing"
import About from "./pages/static/about"
import Contact from "./pages/static/contact"
import Solutions from "./pages/static/solutions"
import Privacy from "./pages/static/privacy"
import Terms from "./pages/static/terms"
import Security from "./pages/static/security"
import Blog from "./pages/static/blog"
import { ModalProvider } from "./contexts/ModalContext"
import { ChatProvider } from "./contexts/ChatContext"

function App() {

  return (
    <div className="text-[14px] 2xl:text-[18px] tracking-[5%] leading-[24px]">
      <BrowserRouter>
      <ModalProvider>
      <AuthProvider>
        <LeadsProvider>
          <ClientsProvider>
            <ChatProvider>
              <Routes>
              {/* Static Pages */}
              <Route path="/" element={<Homepage />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/blog" element={<Blog />} />
              
              {/* Legal Pages */}
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/security" element={<Security />} />
              
              {/* Auth Pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Account Pages */}
              <Route path="/account/*" element={<AccountPages />} />
            </Routes>
            </ChatProvider>
          </ClientsProvider>
        </LeadsProvider>
      </AuthProvider>
      </ModalProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
