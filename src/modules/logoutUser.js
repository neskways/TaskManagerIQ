import Cookies from "js-cookie";

export const logoutUserWithoutToken = () => {

    Cookies.remove("token");
    Cookies.remove("user");
    Cookies.remove("role");
    Cookies.remove("userCode");

};
