import { BrowserRouter, Route, Routes } from "react-router-dom"
import { PAGES } from "../pages"
import ProtectedRoute from "./protectedRoute"

const AppRouter = () => {
    return (
      <BrowserRouter>
         <Routes>
            <Route path='/' element={<h1>Home</h1>} />
            <Route path='/sign-in' element={<PAGES.AUTH.SIGN_IN/>} />
            <Route path='/sign-up' element={<PAGES.AUTH.SIGN_UP/>} />
            <Route element={<ProtectedRoute />}>
               <Route path='/chat' element={<PAGES.CHAT_SCREEN/>} />
            </Route>
         </Routes>
      </BrowserRouter>
    )
}

export default AppRouter