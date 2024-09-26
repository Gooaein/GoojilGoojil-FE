//한줄에 별은 1개만 
const SELECTED_STAR = 'iassets\images/star/starW.png/star.png';
const UNSELECTED_STAR = 'assets\images/star/starW.png/starW.png';

function rate(element) {
    const row = element.parentNode.parentNode; // 현재 별이 속한 행(질문)
    const allStars = row.querySelectorAll('.star'); // 해당 행의 모든 별
    const selectedValue = element.getAttribute('data-value'); // 현재 클릭한 별의 값
    const isSelected = element.src.includes(SELECTED_STAR); // 클릭한 별이 선택된 상태인지 확인

    // 모든 별을 초기화 (img/starW.png로 변경)
    allStars.forEach(star => {
        star.src = UNSELECTED_STAR;
    });

    // 선택된 별을 누르면 선택 취소 
    if (!isSelected) {
        // 클릭한 별만 img/star.png로 변경
        element.src = SELECTED_STAR;
    }
}
