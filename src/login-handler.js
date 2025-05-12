import { FindPosts } from "./data-handler";
let internalResult = null;
let loginStatus = false;

export function LoginHandler() {
  const locStg = "sisvis_login";

  const setJSON = (str) => {
    return JSON.stringify(str);
  };

  const getJSON = (jsn) => {
    return JSON.parse(jsn);
  };

  const LoginAcc = async (data) => {
    try {
      const loginData = await FindPosts(
        "akunAdmin",
        `username=${data.username}&password=${data.password}`
      );
      loginStatus = loginData.length > 0;
      internalResult = loginData[0];
    } catch (error) {}
  };

  (async () => {
    if (localStorage.getItem(locStg) !== null) {
      LoginAcc(getJSON(localStorage.getItem(locStg)));
    }
    //loginStatus = getJSON(localStorage.getItem(locStg)).password;
  })();

  return {
    get result() {
      return internalResult;
    },
    get status() {
      return loginStatus;
    },
    get hasLocal() {
      return localStorage.getItem(locStg) !== null;
    },

    async setData(data) {
      try {
        const loginData = await FindPosts(
          "akunAdmin",
          `username=${data.username}&password=${data.password}`
        );

        if (loginData.length > 0 && localStorage.getItem(locStg) === null) {
          internalResult = loginData[0];
          localStorage.setItem(locStg, setJSON(data));
          loginStatus = true;
        } /*else {
          internalResult = null;

          // Hapus data login jika tidak ditemukan
          localStorage.removeItem("login");
        }*/
      } catch (err) {
        console.error("Login error:", err);
        internalResult = null;
      }
    },
    hapusData() {
      localStorage.removeItem(locStg);
      loginStatus = false;
      internalResult = null;
    },
  };
}
