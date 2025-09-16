import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import axios from "./utils/axios.customize";
import { useContext, useEffect } from "react";
import { AuthContext } from "./components/context/auth.context";
import { Spin } from "antd";


function App() {
  const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

  useEffect(() => {
    (async () => {
      try {
        setAppLoading(true);

        const res = await axios.get("/api/account");
        if (res.data) {
          setAuth({
            isAuthenticated: true,
            user: {
              email: res.data.email,
              name: res.data.name
            }
          });
        }
      } catch (err) {
        console.error("Auth check failed:", err);
        localStorage.removeItem("token"); // optional cleanup
      } finally {
        setAppLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      {appLoading ? (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <Spin />
        </div>
      ) : (
        <>
          <Header />
          <Outlet />
        </>
      )}
    </div>
  );
}

export default App;