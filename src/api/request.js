// 인증 토큰을 가져오는 함수 (여기서는 예시로 localStorage를 사용)

// export const getAuthToken = () => localStorage.getItem('accessToken');

// API 공통 요청 처리기
export const sendRequest = async (instance, method, url, data = {}) => {
  try {
    //instance, method, 추가 url, data 순으로 파라미터를 집어넣어서 데이터를 보내주며, 통일된 request를 보내준다.
    const response = await instance[method](url, data);
    console.log(`✅${instance.defaults.baseURL} -[${method}] success :`, response);
    return response;
  } catch (error) {
    //에러를 케치헀을 경우엔 동일한 형식으로 에러를 cnosole에 띄워준다.
    console.error(
      `❌${url}-[${method}] error_response:`,
      error.response,
      `error_status : `,
      error.response.status,
      `error_status_text: `,
      error.response.statusText
    );
    window.location.href = '/error';
    throw error;
  }
};

// 동적 URL 생성
export const createUrl = (path, params = {}) => {
  const query = Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
  return `${path}${query ? `?${query}` : ''}`;
};
