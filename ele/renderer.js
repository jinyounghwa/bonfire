// renderer.js
// 렌더러 프로세스에서 실행되는 JavaScript 코드

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
  // 액션 버튼에 이벤트 리스너 추가
  const actionButton = document.getElementById('btn-action');
  
  if (actionButton) {
    actionButton.addEventListener('click', () => {
      // 버튼 클릭 시 실행할 코드
      alert('버튼이 클릭되었습니다!');
      
      // 여기에 추가 기능을 구현할 수 있습니다.
      console.log('버튼 클릭 이벤트 발생');
    });
  }
  
  // 추가적인 UI 이벤트 처리 코드를 여기에 작성할 수 있습니다.
});
