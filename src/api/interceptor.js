import Cookies from "js-cookie";

// 인터셉터 적용
export const applyInterceptors = (instance) => {
  instance.interceptors.request.use(
    async (config) => {
      const token = Cookies.get("access_token"); // 'accessToken'은 여러분의 토큰 쿠키 이름입니다
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      } else {
        window.location.href = `/login`;
        // enqueueSnackbar(
        //     `☺️1초 만에 로그인 가능하게 만들어뒀어요!`,
        // );
      }
      return config;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );
};
