import dayjs from 'dayjs';
import { Article } from '../features/article/articles';

const articles: Article[] = [
  {
    createdAt: dayjs().subtract(12, 'day').format(), // dayjs().subtract(13, 'day').subtract(21, 'hour').format(),
    description:
      '웹 서비스를 사용하다 보면 갑자기 화면이 멈추거나, 타이핑한 게 화면에 바로바로 반영되지 않는다거나, 애니메이션이 매끄럽게 동작하지 않는 등의 현상을 종종 마주할 수 있습니다. 사용자 경험을 해치는 대표적인 예라고 할 수 있습니다. 이러한 문제를 야기하는 원인에는 여러 가지가 있을 수 있지만, 그중에서 JavaScript 언어의 특징 중 하나인 run-to-completion, JavaScript 코드가 구동되는 JavaScript 엔진, 콜 스택(call stack), 이벤트 루프(event loop), 태스크 큐(task queue) 등을 중점적으로 살피며 원인을 분석해 보고, 분석한 원인을 바탕으로 몇 가지 해결 방법도 제시해 보겠습니다.',
    favicon:
      'https://engineering.linecorp.com/wp-content/uploads/2019/04/cropped-linev_favicon_1x1_transparent-32x32.png',
    id: 'G38UHlTOgQLtriTkkS2zb',
    image:
      'https://engineering.linecorp.com/wp-content/uploads/2019/11/0109_자바스크립트-비동기-처리.png',
    title:
      'Don\'t block the event loop! 매끄러운 경험을 위한 JavaScript 비동기 처리 - LINE ENGINEERING',
    url:
      'https://engineering.linecorp.com/ko/blog/dont-block-the-event-loop/\',',
    read: false,
  },
  {
    createdAt: dayjs().subtract(13, 'day').subtract(8, 'hour').format(),
    description:
      'A basic button component that should render nicely on any platform. Supports a minimal level of customization.',
    favicon: 'https://reactnative.dev/img/favicon.ico',
    id: '_BQEz6q6Q7NcqttYSlgbo',
    image: 'https://reactnative.dev/img/logo-og.png',
    title: 'Button · React Native',
    url: 'https://reactnative.dev/docs/button',
    read: true,
  },
  {
    createdAt: dayjs().subtract(10, 'day').format(),
    description:
      'CSS in JS 라이브러리를 고민 중이신 여러분께 | 들어가며 많은 프론트엔드 개발자분들이 스타일링에 고통받고 있습니다. 크몽의 프론트엔드 팀 또한 오래되고 방대한 코드 베이스를 가지고 있는 탓에, A페이지의 디자인을 수정하였는데, B페이지의 디자인까지 영향을 받는 예측하기 힘든 사이드 이펙트와 이미 꼬여버린 CSS 우선순위 때문에 !important가 남용되고 있었습니다. 하지만 !important가 좋은 ',
    favicon: 'https://brunch.co.kr/favicon.ico',
    id: '1jSs2suOPw28qccZ7q3vq',
    image:
      'https://img1.daumcdn.net/thumb/R1280x0.fjpg/?fname=http://t1.daumcdn.net/brunch/service/user/sIU/image/j4wr77HjM0b9ooWEVuFi7l4Bs3k.jpg',
    title: 'emotion을 활용한 크몽 프론트엔드 스타일링 시스템',
    url: 'https://brunch.co.kr/@kmongdev/17',
    read: false,
  },
  {
    createdAt: dayjs().format(),
    description:
      'This indicates the difference between two date-time in the specified unit.',
    favicon: 'https://day.js.org/img/favicon.ico',
    id: '8skLwluvR8k2ayPD2GVwF',
    image: 'https://day.js.org/img/logo.png',
    read: false,
    title: 'Difference · Day.js',
    url: 'https://day.js.org/docs/en/display/difference',
  },
];
export default articles;
