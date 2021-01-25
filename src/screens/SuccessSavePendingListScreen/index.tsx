import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

import ArticleCard from '../../components/articleCard/ArticleCard';
import Button, { ButtonSize } from '../../components/Button';
import { RootStackParamList, TabParamList } from '../../config/Navigation';
import { Article } from '../../features/article/articles';
import useArticle from '../../features/article/useArticle';

const fadeInUp = {
  0: {
    opacity: 0,
    translateY: 16,
  },
  1: {
    opacity: 1,
    translateY: 0,
  },
};

function SuccessSavePendingListScreen() {
  const navigation = useNavigation<
    StackNavigationProp<RootStackParamList & TabParamList>
  >();
  const { lastAddedArticle } = useArticle();

  const handlePressClose = () => {
    navigation.navigate('Home', {
      setScrollTop: true,
    });
  };

  const handlePendingListLinkPress = () => {
    navigation.navigate('Home', {
      openPendingList: true,
    });
  };

  return (
    <Container>
      <Content>
        <Header>
          <Animatable.View
            animation={fadeInUp}
            delay={200}
          >
            <TitleWrapper>
              <Title>{'아티클 목록이 가득차서 '}</Title>
              <TouchableOpacity onPress={handlePendingListLinkPress}>
                <Title accent>등록 대기 목록</Title>
              </TouchableOpacity>
              <Title>에 추가되었어요</Title>
            </TitleWrapper>
          </Animatable.View>
          <Animatable.View
            animation={fadeInUp}
            delay={350}
          >
            <SubTitle>아티클 목록이 비워지면 등록해드릴게요</SubTitle>
          </Animatable.View>
        </Header>
        <Animatable.View
          animation={fadeInUp}
          delay={500}
        >
          <ArticleCard article={lastAddedArticle as Article} />
        </Animatable.View>
      </Content>
      <Actions>
        <Button
          onPress={handlePressClose}
          label="완료"
          size={ButtonSize.Large}
        />
      </Actions>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Header = styled.View`
  padding: 0 16px 48px 16px;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
`;

const TitleWrapper = styled.View`
  flex-direction: row;
  margin: 0 0 8px 0;
  flex-wrap: wrap;
`;

const Title = styled.Text<{ accent?: boolean }>`
  font-size: 24px;
  line-height: 30px;
  font-weight: bold;
  color: ${(props) => (props.accent
    ? props.theme.colors.typography.point
    : props.theme.colors.typography.primary)};
`;

const SubTitle = styled.Text`
  font-size: 18px;
  line-height: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.typography.secondary};
  flex-wrap: wrap;
`;

const Actions = styled.View`
  padding: 16px;
`;

export default SuccessSavePendingListScreen;
