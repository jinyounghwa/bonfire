// renderer.js
// 렌더러 프로세스에서 실행되는 JavaScript 코드

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
  // 비디오 및 오디오 요소와 컨트롤 버튼 가져오기
  const videoPlayer = document.getElementById('video-player');
  const audioPlayer = document.getElementById('audio-player');
  const videoContainer = document.querySelector('.video-wrapper');
  
  const playPauseBtn = document.getElementById('play-pause');
  const muteUnmuteBtn = document.getElementById('mute-unmute');
  const timerBtn = document.getElementById('timer-btn');
  const fullscreenBtn = document.getElementById('fullscreen-btn');
  
  // 타이머 관련 요소
  const timerPopup = document.getElementById('timer-popup');
  const hoursInput = document.getElementById('hours');
  const minutesInput = document.getElementById('minutes');
  const secondsInput = document.getElementById('seconds');
  const setTimerBtn = document.getElementById('set-timer');
  const cancelTimerBtn = document.getElementById('cancel-timer');
  
  // 타이머 표시 요소 생성
  const timerDisplay = document.createElement('div');
  timerDisplay.className = 'timer-display';
  document.querySelector('.video-wrapper').appendChild(timerDisplay);
  
  // 초기 상태 설정
  let isPlaying = false;
  let isMuted = false;
  let isLooping = true;
  let isAudioPlaying = true;
  let timerInterval = null;
  let remainingTime = 0;
  let isFullscreen = false;
  
  // 초기 설정 적용
  videoPlayer.loop = isLooping;
  audioPlayer.loop = isLooping;
  
  // 자동 재생 시도
  Promise.all([
    videoPlayer.play().catch(e => console.error('비디오 자동 재생 실패:', e)),
    audioPlayer.play().catch(e => console.error('오디오 자동 재생 실패:', e))
  ]).then(() => {
    console.log('비디오와 오디오가 성공적으로 재생됩니다.');
    isPlaying = true;
    isAudioPlaying = true;
    playPauseBtn.textContent = '일시정지';
  }).catch(error => {
    console.error('미디어 재생 실패:', error);
  });
  
  // 재생/일시정지 버튼 이벤트 처리
  playPauseBtn.addEventListener('click', () => {
    if (isPlaying) {
      videoPlayer.pause();
      if (isAudioPlaying) {
        audioPlayer.pause();
      }
      playPauseBtn.textContent = '재생';
    } else {
      videoPlayer.play().catch(e => console.error('비디오 재생 실패:', e));
      if (isAudioPlaying) {
        audioPlayer.play().catch(e => console.error('오디오 재생 실패:', e));
      }
      playPauseBtn.textContent = '일시정지';
    }
    isPlaying = !isPlaying;
  });
  
  // 음소거 버튼 이벤트 처리
  muteUnmuteBtn.addEventListener('click', () => {
    videoPlayer.muted = !videoPlayer.muted;
    audioPlayer.muted = !audioPlayer.muted;
    isMuted = videoPlayer.muted;
    muteUnmuteBtn.textContent = isMuted ? '음소거 해제' : '음소거';
  });
  
  // 타이머 버튼 이벤트 처리
  timerBtn.addEventListener('click', () => {
    // 팝업 표시
    timerPopup.style.display = 'flex';
  });
  
  // 전체화면 버튼 이벤트 처리
  fullscreenBtn.addEventListener('click', () => {
    toggleFullscreen();
  });
  
  // 전체화면 토글 함수
  function toggleFullscreen() {
    if (!isFullscreen) {
      // 전체화면으로 전환
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.mozRequestFullScreen) { // Firefox
        videoContainer.mozRequestFullScreen();
      } else if (videoContainer.webkitRequestFullscreen) { // Chrome, Safari, Opera
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.msRequestFullscreen) { // IE/Edge
        videoContainer.msRequestFullscreen();
      }
      fullscreenBtn.textContent = '전체화면 취소';
    } else {
      // 전체화면 취소
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) { // Chrome, Safari, Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
      }
      fullscreenBtn.textContent = '전체화면';
    }
    isFullscreen = !isFullscreen;
  }
  
  // 전체화면 변경 이벤트 리스너
  document.addEventListener('fullscreenchange', updateFullscreenStatus);
  document.addEventListener('webkitfullscreenchange', updateFullscreenStatus);
  document.addEventListener('mozfullscreenchange', updateFullscreenStatus);
  document.addEventListener('MSFullscreenChange', updateFullscreenStatus);
  
  // 전체화면 상태 업데이트 함수
  function updateFullscreenStatus() {
    isFullscreen = !!(document.fullscreenElement || document.webkitFullscreenElement || 
                     document.mozFullScreenElement || document.msFullscreenElement);
    fullscreenBtn.textContent = isFullscreen ? '전체화면 취소' : '전체화면';
  }
  
  // 타이머 설정 버튼 이벤트 처리
  setTimerBtn.addEventListener('click', () => {
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    // 총 시간(초 단위)
    remainingTime = hours * 3600 + minutes * 60 + seconds;
    
    if (remainingTime > 0) {
      // 타이머 시작
      startTimer();
      // 팝업 닫기
      timerPopup.style.display = 'none';
    } else {
      alert('시간을 설정해주세요.');
    }
  });
  
  // 타이머 취소 버튼 이벤트 처리
  cancelTimerBtn.addEventListener('click', () => {
    // 팝업 닫기
    timerPopup.style.display = 'none';
  });
  
  // 닫기 버튼 이벤트 처리
  document.getElementById('close-btn').addEventListener('click', () => {
    window.close();
  });
  
  // 타이머 시작 함수
  function startTimer() {
    // 이전 타이머가 있으면 제거
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // 타이머 표시 업데이트 및 표시
    updateTimerDisplay();
    timerDisplay.style.display = 'block';
    
    // 타이머 간격 설정 (1초마다)
    timerInterval = setInterval(() => {
      // 남은 시간 감소
      remainingTime--;
      
      // 타이머 표시 업데이트
      updateTimerDisplay();
      
      // 타이머 종료 시
      if (remainingTime <= 0) {
        clearInterval(timerInterval);
        timerInterval = null;
        
        // 미디어 정지
        videoPlayer.pause();
        audioPlayer.pause();
        isPlaying = false;
        playPauseBtn.textContent = '재생';
        
        // 타이머 표시 숨기기
        timerDisplay.style.display = 'none';
        
        // 알림
        alert('타이머가 종료되었습니다.');
      }
    }, 1000);
  }
  
  // 타이머 표시 업데이트 함수
  function updateTimerDisplay() {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = remainingTime % 60;
    
    // 시간 형식 (HH:MM:SS)
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // 타이머 표시 업데이트
    timerDisplay.textContent = `남은 시간: ${timeString}`;
  }
  
  // 비디오 및 오디오 이벤트 처리
  videoPlayer.addEventListener('ended', () => {
    console.log('비디오 재생 완료');
    if (!videoPlayer.loop) {
      videoPlayer.currentTime = 0;
      isPlaying = false;
      playPauseBtn.textContent = '재생';
    }
  });
  
  audioPlayer.addEventListener('ended', () => {
    console.log('오디오 재생 완료');
    if (!audioPlayer.loop) {
      audioPlayer.currentTime = 0;
      isAudioPlaying = false;
    }
  });
  
  // 오류 처리
  videoPlayer.addEventListener('error', (e) => {
    console.error('비디오 재생 오류:', e);
  });
  
  audioPlayer.addEventListener('error', (e) => {
    console.error('오디오 재생 오류:', e);
  });
  
  // ESC 키로 앱 종료 기능 추가
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !document.fullscreenElement) {
      // 전체화면 상태가 아닐 때만 앱 종료
      window.close();
    }
  });
});
