/**
 * 주어진 Date 객체를 "YYYY-MM-DDTHH:mm:ss" 형식의 문자열로 변환합니다.
 * @param {Date} date - 변환할 Date 객체
 * @returns {string} "YYYY-MM-DDTHH:mm:ss" 형식의 문자열
 */
export const formatDateToISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

/**
 * 현재 날짜와 시간을 "YYYY-MM-DDTHH:mm:ss" 형식의 문자열로 반환합니다.
 * @returns {string} "YYYY-MM-DDTHH:mm:ss" 형식의 문자열
 */
export const getCurrentDateTimeISO = () => {
  return formatDateToISO(new Date());
};
