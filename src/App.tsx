import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/auth/login"
import AuthProvider from "./contexts/AuthContext"
import LeadsProvider from "./contexts/LeadsContext"
import ClientsProvider from "./contexts/ClientsContext"
import Signup from "./pages/auth/signup"
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
              <Route path="/signup" element={<Signup />} />
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
