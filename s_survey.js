function rate(star, question) {
    // 모든 별을 빈 별 이미지로 리셋
    let stars = document.querySelectorAll(`img[onclick^="rate(this, '${question}')"]`);
    stars.forEach(s => {
        s.src = 'img/starW.png';
    });

    // 클릭된 별만 채워진 별로 변경
    star.src = 'img/star.png';

    // 선택한 값 저장 (필요할 경우 폼으로 전송하기 위해)
    let existingInput = document.querySelector(`input[name="${question}"]`);
    if (existingInput) {
        existingInput.value = star.getAttribute('data-value');
    } else {
        let input = document.createElement('input');
        input.type = 'hidden';
        input.name = question;
        input.value = star.getAttribute('data-value');
        document.querySelector('form').appendChild(input);
    }
}
function goBack() {
    window.history.back();
}
