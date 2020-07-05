import * as React from 'react';
import { Image, Text, useColorScheme } from 'react-native';
import styled from 'styled-components/native';
import willreadLight from '../../assets/willread-light.png';
import willreadDark from '../../assets/willread-dark.png';
import RecommendCard, { WillreadItem as IWillreadItem } from '../components/RecommendCard';
import WillreadCard from '../components/WillreadCard';
import CategoryFilter, { CategoryColors } from '../components/CategoryFilter';

const recommendItem: IWillreadItem = {
  id: '',
  uri: 'https://meetup.toast.com/posts/242',
  imageUri: 'https://image.toast.com/aaaadh/real/2020/repimg/main(18)_thumbnail.png',
  // imageURI: 'http://t1.daumcdn.net/brunch/service/user/sIU/image/j4wr77HjM0b9ooWEVuFi7l4Bs3k.jpg',
  title: '라이트하우스 6.0에서 바뀐 성능 지표변화',
  minutesToRead: 5,
  categoryColor: CategoryColors.RED,
};

let willreadItemKey = 0;
const willreadItems: IWillreadItem[] = [{
  id: String(willreadItemKey++),
  uri: 'https://music.youtube.com/channel/UCjtRpp1nyQDB1MuDQk1tIMA',
  imageUri: 'https://miro.medium.com/max/1400/1*zrElooE3nz0oaZIhaIbLKQ.jpeg',
  title: 'Youtube',
  minutesToRead: 5,
  categoryColor: CategoryColors.RED,
}, {
  id: String(willreadItemKey++),
  uri: 'https://ui.toast.com/weekly-pick/ko_20200623',
  imageUri: 'https://miro.medium.com/max/1400/1*zrElooE3nz0oaZIhaIbLKQ.jpeg',
  title: '리액트 앱에서의 중앙 집중식 API 에러 핸들링 | TOAST UI :: Make Your Web Delicious!',
  minutesToRead: 5,
  categoryColor: CategoryColors.DEFAULT,
}, {
  id: String(willreadItemKey++),
  uri: 'https://engineering.linecorp.com/ko/blog/dont-block-the-event-loop/',
  imageUri: 'https://engineering.linecorp.com/wp-content/uploads/2019/11/eventloop1-1024x468.png',
  title: 'Don’t block the event loop! 매끄러운 경험을 위한 JavaScript 비동기 처리',
  minutesToRead: 5,
  categoryColor: CategoryColors.BLUE,
}, {
  id: String(willreadItemKey++),
  uri: 'https://engineering.linecorp.com/ko/blog/server-side-test-automation-5/',
  imageUri: 'https://engineering-org.line-apps.com/ko/testauto13/',
  title: '서버 사이드 테스트 자동화 여정 – 5. 성능 테스트 리포트 생성 및 자동화 시스템 업무 적용 결과',
  minutesToRead: 5,
  categoryColor: CategoryColors.GREEN,
}, {
  id: String(willreadItemKey++),
  uri: 'https://kmong.com',
  imageUri: 'https://engineering-org.line-apps.com/ko/testauto13/',
  title: '크몽',
  minutesToRead: 5,
  categoryColor: CategoryColors.YELLOW,
}];

function HomeScreen(): React.ReactElement {
  const scheme = useColorScheme();
  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Header>
          <Image style={{ width: 160 }} resizeMode="contain" source={scheme === 'dark' ? willreadDark : willreadLight} />
        </Header>
        <RecommendCard item={recommendItem} />
        <CategoryFilter />
        {willreadItems.map((item) => <WillreadCard key={item.id} item={item} />)}
      </ScrollView>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const ScrollView = styled.ScrollView`
  flex: 1;
`;

const Header = styled.View`
  padding: 32px 16px;
`;

export default HomeScreen;
