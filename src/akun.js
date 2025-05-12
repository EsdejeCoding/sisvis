import React, { useState } from "react";
import { LoginHandler } from "./login-handler";

export default function Akun() {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [logoutAlert, setLogoutAlert] = useState(false);
  return (
    <>
      <button
        className="text-blue-800"
        onClick={() => {
          setLogoutAlert(true);
        }}
      >
        Logout
      </button>
      {logoutAlert && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
              <h3 className="font-medium mb-3">Logout</h3>
              <p className="mb-4">Apakah anda ingin keluar?</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setLogoutAlert(false);
                  }}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg text-gray-800 font-medium"
                >
                  Tidak
                </button>
                <button
                  onClick={() => {
                    LoginHandler().hapusData();
                    window.location.href = "/#/login";
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
                >
                  Ya
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
