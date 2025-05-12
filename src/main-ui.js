import React, { useEffect, useState } from "react";
import { LoginHandler } from "./login-handler";
import "./App.css";
import Home from "./home";
import InputHarga from "./input-harga";
import StrukCetak from "./struk-cetak";
import Akun from "./akun";
export default function MainUi({ page }) {
  const { hasLocal, status } = LoginHandler();
  const [loginStat, setLoginStat] = useState(false);
  const [loadingData, setLoadingData] = useState(0);
  useEffect(() => {
    if (hasLocal && !loginStat) {
      setTimeout(() => {
        setLoginStat(status);
        setLoadingData(loadingData + 1);
      }, 1000);
    } else if (!hasLocal) window.location.href = "/#/login";
  }, [loadingData]);
  if (hasLocal)
    return (
      <>
        {!loginStat && (
          <div className="h-screen flex flex-col justify-center items-center">
            <div className="load-holder text-3xl font-bold text-blue-800">
              LOADING
            </div>
          </div>
        )}
        {loginStat && (
          <>
            {page === "home" && <Home page={page} />}
            {page === "harga" && <InputHarga page={page} />}
            {page === "struk" && <StrukCetak effect={true} />}
            {page === "akun" && <Akun />}
          </>
        )}
      </>
    );
}
