import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/appRouter";
import AuthBootstrap from "./router/authBootstrap";
import { ThemeModeProvider } from "./theme/themeContext";

function App() {
  return (
    <BrowserRouter>
      <ThemeModeProvider>
        <AuthBootstrap>
          <AppRouter />
        </AuthBootstrap>
      </ThemeModeProvider>
    </BrowserRouter>
  );
}

export default App;
