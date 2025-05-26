import { BrowserRouter, Route, Routes } from "react-router-dom"
import { PAGES } from "../pages"

const AppRouter = () => {
    return (
      <BrowserRouter>
         <Routes>
            <Route path='/' element={<h1>Home</h1>} />
            <Route path='/sign-in' element={<PAGES.AUTH.SIGN_IN/>} />
            <Route path='/sign-up' element={<PAGES.AUTH.SIGN_UP/>} />
         </Routes>
      </BrowserRouter>
    )
}

export default AppRouter