import React, { useEffect, useState } from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import FormUi from "./form-ui";
import Home from "./home";
import InputHarga from "./input-harga";
import CustomerLooker from "./customer-looker";
import StrukCetak from "./struk-cetak";
import { LoginHandler } from "./login-handler";
import MainUi from "./main-ui";

function App() {
  const loginStrg = LoginHandler();
  const [loginStatus, setLoginStatus] = useState(loginStrg.status);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<MainUi page={"home"} />} />
          <Route path="/login" element={<FormUi useFor={"login"} />} />
          <Route path="/signup" element={<FormUi useFor={"signup"} />} />
          <Route path="/home" element={<MainUi page={"home"} />} />
          <Route path="/harga" element={<MainUi page={"harga"} />} />
          <Route path="/akun" element={<MainUi page={"akun"} />} />
          <Route path="/antrian/:id/:nomer" element={<CustomerLooker />} />
          <Route path="/struk/:id" element={<MainUi page={"struk"} />} />
          <Route path="*" element={<h1>Halaman Tidak Ada</h1>} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
