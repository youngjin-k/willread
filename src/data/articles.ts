import { CategoryColors } from '../features/homeCategoryFilters';

const articles = [{
  id: '111',
  uri: 'https://music.youtube.com/channel/UCjtRpp1nyQDB1MuDQk1tIMA',
  imageUri: 'https://miro.medium.com/max/1400/1*zrElooE3nz0oaZIhaIbLKQ.jpeg',
  title: 'Youtube',
  minutesToRead: 5,
  categoryColor: CategoryColors.RED,
}, {
  id: '112',
  uri: 'https://ui.toast.com/weekly-pick/ko_20200623',
  imageUri: 'https://miro.medium.com/max/1400/1*zrElooE3nz0oaZIhaIbLKQ.jpeg',
  title: '리액트 앱에서의 중앙 집중식 API 에러 핸들링 | TOAST UI :: Make Your Web Delicious!',
  minutesToRead: 5,
  categoryColor: CategoryColors.DEFAULT,
}, {
  id: '113',
  uri: 'https://engineering.linecorp.com/ko/blog/dont-block-the-event-loop/',
  imageUri: 'https://engineering.linecorp.com/wp-content/uploads/2019/11/eventloop1-1024x468.png',
  title: 'Don’t block the event loop! 매끄러운 경험을 위한 JavaScript 비동기 처리',
  minutesToRead: 5,
  categoryColor: CategoryColors.BLUE,
}, {
  id: '114',
  uri: 'https://engineering.linecorp.com/ko/blog/server-side-test-automation-5/',
  imageUri: 'https://engineering-org.line-apps.com/ko/testauto13/',
  title: '서버 사이드 테스트 자동화 여정 – 5. 성능 테스트 리포트 생성 및 자동화 시스템 업무 적용 결과',
  minutesToRead: 5,
  categoryColor: CategoryColors.GREEN,
}, {
  id: '115',
  uri: 'https://kmong.com',
  imageUri: 'https://engineering-org.line-apps.com/ko/testauto13/',
  title: '크몽',
  minutesToRead: 5,
  categoryColor: CategoryColors.YELLOW,
}];

export default articles;
