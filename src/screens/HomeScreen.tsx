import * as React from 'react';
import { Image, Text, useColorScheme } from 'react-native';
import styled from 'styled-components/native';
import willreadLight from '../../assets/willread-light.png';
import willreadDark from '../../assets/willread-dark.png';
import RecommendCard, { WillreadItem as IWillreadItem } from '../components/RecommendCard';
import WillreadItem from '../components/WillreadItem';
import CategoryFilter from '../components/CategoryFilter';

const recommendItem: IWillreadItem = {
  id: '',
  URI: 'https://meetup.toast.com/posts/242',
  imageURI: 'https://image.toast.com/aaaadh/real/2020/repimg/main(18)_thumbnail.png',
  // imageURI: 'http://t1.daumcdn.net/brunch/service/user/sIU/image/j4wr77HjM0b9ooWEVuFi7l4Bs3k.jpg',
  title: '라이트하우스 6.0에서 바뀐 성능 지표변화',
  minutesToRead: 5,
};

let willreadItemKey = 0;
const willreadItems: IWillreadItem[] = [{
  id: String(willreadItemKey++),
  URI: 'https://meetup.toast.com/posts/242',
  imageURI: 'http://t1.daumcdn.net/brunch/service/user/sIU/image/j4wr77HjM0b9ooWEVuFi7l4Bs3k.jpg',
  title: '라이트하우스 6.0에서 바뀐 성능 지표변화',
  minutesToRead: 5,
}, {
  id: String(willreadItemKey++),
  URI: 'https://meetup.toast.com/posts/242',
  imageURI: 'https://image.toast.com/aaaadh/real/2020/repimg/main(18)_thumbnail.png',
  title: '라이트하우스 6.0에서 바뀐 성능 지표변화라이트하우스 6.0에서 바뀐 성능 지표변화라이트하우스 6.0에서 바뀐 성능 지표변화',
  minutesToRead: 5,
}, {
  id: String(willreadItemKey++),
  URI: 'https://meetup.toast.com/posts/242',
  imageURI: 'https://image.toast.com/aaaadh/real/2020/repimg/main(18)_thumbnail.png',
  title: '라이트하우스 6.0에서 바뀐 성능 지표변화라이트하우스 6.0에서 바뀐 성능 지표변화라이트하우스 6.0에서 바뀐 성능 지표변화',
  minutesToRead: 5,
}];

function HomeScreen(): React.ReactElement {
  const scheme = useColorScheme();
  return (
    <Container>
      <ScrollView
        showsVerticalScrollIndicator={false}
      >
        <Header>
          <Image source={scheme === 'dark' ? willreadDark : willreadLight} />
        </Header>
        <RecommendCard item={recommendItem} />
        <CategoryFilter />
        {willreadItems.map((item) => <WillreadItem key={item.id} item={item} />)}
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
