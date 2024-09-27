// config.js
const isTestMode = process.env.REACT_APP_TEST_MODE === "TRUE";

export const config = {
  isTestMode,
  withCredentials: !isTestMode,
  authToken: isTestMode
    ? "Bearer eyJKV1QiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJ1dWlkIjoxLCJ0b2tlbl90eXBlIjoiYWNjZXNzIiwicm9sZSI6IlVTRVIiLCJpYXQiOjE3Mjc0MzI2MTIsImV4cCI6MTcyODAzNzQxMn0.js3B9tk6csmI2vIMIQUfTHF6PdmTOf0lCs0aZcSX3iHY6TTew-tPAYPqJNZw-AekuJa2FAS3pF-xvcuFAAU6tA"
    : null, // 테스트용 토큰
  BASE_URL: process.env.REACT_APP_BACKEND_SERVER_URL,
  STOMP_URL: process.env.REACT_APP_BACKEND_SERVER_STOMP_URL,
};
