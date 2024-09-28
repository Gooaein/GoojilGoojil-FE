import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const useAuthCookies = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  useEffect(() => {
    const fetchedAccessToken = Cookies.get("access_token");
    const fetchedRefreshToken = Cookies.get("refresh_token");

    if (fetchedAccessToken) {
      setAccessToken(`Bearer ${fetchedAccessToken}`);
    } else {
      console.log("설정된 쿠키가 없습니다.");
    }
    if (fetchedRefreshToken) setRefreshToken(fetchedRefreshToken);
  }, []);

  const setAuthCookies = (access, refresh) => {
    Cookies.set("access_token", access, { secure: true, sameSite: "strict" });
    Cookies.set("refresh_token", refresh, { secure: true, sameSite: "strict" });
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  const clearAuthCookies = () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    setAccessToken(null);
    setRefreshToken(null);
  };

  return {
    accessToken,
    refreshToken,
    setAuthCookies,
    clearAuthCookies,
  };
};

export default useAuthCookies;
