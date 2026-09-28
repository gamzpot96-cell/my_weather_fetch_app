// 도시별 좌표 목록 (Openweather 무료 API)
const CITIES = {
  seoul: { name: '서울 (Seoul)', lat: 37.5683, lon: 126.9778 },
  busan: { name: '부산 (Busan)', lat: 35.1028, lon: 129.0403 },
  daegu: { name: '대구 (Daegu)', lat: 35.8, lon: 128.55 },
  incheon: { name: '인천 (Incheon)', lat: 37.45, lon: 126.4161 },
  gwangju: { name: '광주 (Gwangju)', lat: 35.1547, lon: 126.9156 },
};

const logBox = document.getElementById('logBox');
const resultCard = document.getElementById('resultCard');
const cityNameEl = document.getElementById('cityName');
const cityTempEl = document.getElementById('cityTemp');
const cityExtraEl = document.getElementById('cityExtra');

function log(msg) {
  const time = new Date().toLocaleTimeString();
  logBox.textContent += `\n[${time}] ${msg}`;
  logBox.scrollTop = logBox.scrollHeight;
}

function clearLog() {
  logBox.textContent = '> 콘솔이 초기화되었습니다.';
}

// 버튼 클릭 이벤트
document.getElementById('btnFetch').addEventListener('click', () => {
  const cityKey = document.getElementById('citySelect').value;
  const target = CITIES[cityKey];
  console.log(target.name)
  console.log(`선택된 도시: ${target.name} (위도: ${target.lat}, 경도: ${target.lon})`);
  // const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityKey}&units=metric&lang=kr&appid=01f8c007f4b5c28af684b2b8e9c1b340`;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityKey}&units=metric&lang=kr&appid=${OPENWEATHER_API_KEY}`;

  log(`1. fetch() 주문서 발송: ${target.name}`);
  resultCard.classList.add('d-none');

  // ==========================================================
  // [핵심] 오직 fetch와 .then() 체인만 사용하는 기본 문법
  // ==========================================================
  fetch(url)
    .then((response) => {
      console.log(`2. 서버 응답 도착 (HTTP 상태 코드: ${response.status})`);
      if (!response.ok) {
        throw new Error(`HTTP 에러 발생: ${response.status}`);
      }
      // 응답 본문을 JSON 객체로 파싱하여 다음 then으로 전달
      return response.json();
    })
    .then((data) => {
      console.log(`3. JSON 데이터 수신 완료!`);
      console.log(data);
      const current = data.main;
      log(`3. JSON 번역 완료! 기온: ${current.temp}℃ / 습도: ${current.humidity}%`);

      // 화면에 표시
      cityNameEl.textContent = target.name;
      cityTempEl.textContent = `${current.temp} ℃`;
      cityExtraEl.textContent = `습도: ${data.main.humidity}% | 풍속: ${data.wind.speed} km/h`;
      resultCard.classList.remove('d-none');
    })
    .catch((error) => {
      log(`❌ 에러 발생: ${error.message}`);
      log(`날씨 정보를 가져오지 못했습니다: ${error.message}`);
    })
    .finally(() => {
      log(`4. fetch 요청 사이클 완료`);
    });
});
