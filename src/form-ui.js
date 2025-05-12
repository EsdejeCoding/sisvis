import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { createPost, loginAkun } from "./data-handler";
import { LoginHandler } from "./login-handler";

function FormUi(prop) {
  const loginHandler = LoginHandler();
  const [loginStat, setLoginStat] = useState(true);
  const [loadingData, setLoadingData] = useState(0);

  const FormUtilObj = () => {
    if (prop.useFor === "signup")
      return {
        for: "Daftar",
        callAction: {
          question: "Sudah memiliki akun?",
          anchor: "Masuk ke akun anda",
          href: "/login",
        },
        heading: "Buat Akun Baru",
        input: ["text", "email", "password", "confirm-password"],
      };
    if (prop.useFor === "login")
      return {
        for: "Masuk",
        callAction: {
          question: "Belum memiliki akun?",
          anchor: "Daftarkan akun anda",
          href: "/signup",
        },
        heading: "Masuk ke Akun",
        input: ["text", "password"],
      };
  };
  const [formUtil, setFormUtil] = useState(FormUtilObj());
  const [eventForm, setEventForm] = useState(false);
  const [submited, setSubmited] = useState(false);
  const [inputValue, setInputValue] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [togglePassword, setTogglePassword] = useState([false, false]);

  useEffect(() => {
    if (loginStat) {
      setTimeout(() => {
        setLoginStat(loginHandler.status);
        setLoadingData(loadingData + 1);
      }, 1000);
    }
    setFormUtil(FormUtilObj());
    setEventForm(false);
    setSubmited(false);
    setInputValue({
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    });
    setTogglePassword([false, false]);
  }, [prop.useFor, loginStat, loginHandler.status]);

  const SignUpAkun = async () => {
    try {
      const signData = await createPost("akunAdmin", {
        ...inputValue,
        type: "admin",
      });
      await loginHandler.setData({
        username: inputValue.username,
        password: inputValue.password,
      });
      setLoginStat(loginHandler.status);
      console.log("SIGNUP", signData);
    } catch (error) {}
  };

  const LogInAkun = async () => {
    try {
      await loginHandler.setData({
        username: inputValue.username,
        password: inputValue.password,
      });
      setLoginStat(loginHandler.status);
      //console.log(loginHandler.result);
    } catch (error) {}
  };

  const SubmitForm = (event) => {
    event.preventDefault();
    setSubmited(true);

    let inputAvail = true;
    if (prop.useFor === "signup") {
      for (let key in inputValue) {
        if (inputValue[key].trim().length < 1) {
          inputAvail = false;
          break;
        }
      }
      if (inputAvail) SignUpAkun();
    }
    if (prop.useFor === "login") {
      inputAvail =
        inputValue.username.length > 0 === inputValue.password.length > 0;
      if (inputAvail) {
        LogInAkun();
      }
    }

    console.log(inputAvail);
  };
  const TextInput = (event, id) => {
    const inputValueForm = event.currentTarget.value;
    setInputValue((prev) => ({
      ...prev,
      [id.includes("text") ? "username" : id.replace("-", "_")]:
        inputValueForm.trim(),
    }));
  };

  const InputForm = (tp, fnc) => {
    let userName = tp.includes("text");
    let typePassword = (elem) => {
      return tp.includes("password") ? (
        <>
          <div
            className="mt-1 w-full flex rounded-lg border border-gray-300"
            key={"wrap" + tp}
          >
            {elem}
            <label className="w-1/12 flex justify-center items-center">
              <FontAwesomeIcon
                icon={
                  togglePassword[tp.includes("confirm") ? 1 : 0]
                    ? faEyeSlash
                    : faEye
                }
              />
              <input
                onChange={(e) => {
                  setTogglePassword((prev) => {
                    const newState = [...prev];
                    newState[tp.includes("confirm") ? 1 : 0] =
                      !newState[tp.includes("confirm") ? 1 : 0];
                    return newState;
                  });
                }}
                type="checkbox"
                className="hidden"
              />
            </label>
          </div>
          {(() => {
            if (submited && tp.includes("password")) {
              if (
                tp.includes("confirm") &&
                inputValue.password !== inputValue.confirm_password
              )
                return (
                  <span className="text-red-500">*Password tidak sama</span>
                );
              if (inputValue[tp.replace("-", "_")].length < 1) {
                return <span className="text-red-500">*Harus diisi</span>;
              }
            }
          })()}
        </>
      ) : (
        <>
          {elem}
          {(() => {
            if (submited && inputValue[userName ? "username" : tp].length < 1) {
              return <span className="text-red-500">*Harus diisi</span>;
            }
          })()}
        </>
      );
    };
    return (
      <>
        <div>
          <label
            htmlFor={userName ? "username" : tp}
            className="block text-sm font-medium text-gray-700 capitalize"
          >
            {userName ? "username" : tp.replace("-", " ")}
          </label>
          {typePassword(
            <input
              key={tp}
              type={
                togglePassword[tp.includes("confirm") ? 1 : 0] &&
                tp.includes("password")
                  ? "text"
                  : tp.replace("confirm-", "")
              }
              id={userName ? "username" : tp}
              required=""
              className={`rounded-lg ${
                tp.includes("password")
                  ? "w-11/12"
                  : "mt-1 w-full border border-gray-300"
              } px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none`}
              onChange={fnc}
              value={
                eventForm
                  ? inputValue[userName ? "username" : tp.replace("-", "_")]
                  : ""
              }
            />
          )}
        </div>
      </>
    );
  };
  if (!loginHandler.hasLocal)
    return (
      <>
        <header className="p-4 mb-6 text-center">
          <h1 className="text-3xl font-bold text-blue-800">
            SISVIS - Sistem Informasi Servis
          </h1>
          <div className="mt-2 text-gray-600">
            {formUtil.callAction.question}{" "}
            <Link
              to={formUtil.callAction.href}
              className="text-blue-500 hover:underline"
            >
              {formUtil.callAction.anchor}
            </Link>
          </div>
        </header>
        <main className="w-full">
          <div className="flex justify-center">
            <div className="border border-gray-100 rounded-2xl bg-white p-6 shadow-md max-w-md w-96">
              <h2 className="mb-4 text-2xl font-semibold text-gray-800">
                {formUtil.heading}
              </h2>
              <form onSubmit={SubmitForm} className="space-y-4">
                {formUtil.input.map((elem, index) => {
                  return InputForm(elem, (e) => {
                    setEventForm(true);
                    setSubmited(false);
                    TextInput(e, elem);
                  });
                })}
                {prop.useFor === "login" ? (
                  <Link to="#" className="text-blue-500 hover:underline">
                    Lupa Password?
                  </Link>
                ) : (
                  ""
                )}
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white transition duration-200 hover:bg-blue-700"
                >
                  {formUtil.for}
                </button>
              </form>
            </div>
          </div>
        </main>
      </>
    );
  else window.location.href = "/#/home";
}

export default FormUi;
