import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router/appRouter";
import AuthBootstrap from "./router/authBootstrap";

function App() {
  return (
    <BrowserRouter>
      <AuthBootstrap>
        <AppRouter />
      </AuthBootstrap>
    </BrowserRouter>
  );
}

export default App;
