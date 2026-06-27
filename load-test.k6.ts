import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const loginDuration = new Trend('login_duration');

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Разогрев: 0 → 10 пользователей
    { duration: '1m', target: 50 },    // Нагрузка: до 50 пользователей
    { duration: '30s', target: 100 },  // Пик: до 100 пользователей
    { duration: '30s', target: 0 },    // Спад
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // 95% запросов быстрее 2s
    http_req_failed: ['rate<0.05'],     // Менее 5% ошибок
    errors: ['rate<0.05'],
  },
};

const BASE_URL = 'https://api.demoblaze.com';

function encodePassword(password: string): string {
  return btoa(password);
}

export default function () {
  // Тест: логин
  const loginPayload = JSON.stringify({
    username: `loadtest_user_${__VU}`,
    password: encodePassword('testpass123'),
  });

  const loginStart = Date.now();
  const loginRes = http.post(`${BASE_URL}/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  loginDuration.add(Date.now() - loginStart);

  const loginOk = check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login response time < 2000ms': (r) => r.timings.duration < 2000,
  });

  errorRate.add(!loginOk);
  sleep(1);

  // Тест: получение каталога
  const catalogRes = http.post(`${BASE_URL}/entries`, '{}', {
    headers: { 'Content-Type': 'application/json' },
  });

  const catalogOk = check(catalogRes, {
    'catalog status is 200': (r) => r.status === 200,
    'catalog has items': (r) => {
      try {
        const body = JSON.parse(r.body as string);
        return body.Items && body.Items.length > 0;
      } catch {
        return false;
      }
    },
    'catalog response time < 1500ms': (r) => r.timings.duration < 1500,
  });

  errorRate.add(!catalogOk);
  sleep(1);
}
