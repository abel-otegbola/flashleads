import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/auth/login"
import AuthProvider from "./contexts/AuthContext"
import LeadsProvider from "./contexts/LeadsContext"
import UserProfileProvider from "./contexts/UserProfileContext"
import ThemeProvider from "./contexts/ThemeContext"
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
import MouseCursor from "./components/mouseCursor/MouseCursor"
import FindBusinesses from "./pages/static/find-businesses"
import StaticLeadDetails from "./pages/static/business"

function App() {

  return (
    <div className="text-[14px] md:text-[15px] 2xl:text-[16px] bg-background text-text tracking-[5%]">
      <BrowserRouter>
      <ThemeProvider>
      <ModalProvider>
      <AuthProvider>
        <UserProfileProvider>
        <LeadsProvider>
            
              <MouseCursor />
              <Routes>
              {/* Static Pages */}
              <Route path="/" element={<Homepage />} />
              <Route path="/integrations" element={<Integrations />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/solutions" element={<Solutions />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/find-businesses" element={<FindBusinesses />} />
              <Route path="/business/:id" element={<StaticLeadDetails />} />
              
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
        </LeadsProvider>
        </UserProfileProvider>
      </AuthProvider>
      </ModalProvider>
      </ThemeProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
