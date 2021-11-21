import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import * as Animatable from 'react-native-animatable';
import { useColorScheme } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import styled from 'styled-components/native';

import ArticleCard from '../../components/articleCard/ArticleCard';
import Button, { ButtonSize, ButtonVariant } from '../../components/Button';
import { RootStackParamList, TabParamList } from '../../config/Navigation';
import { Article } from '../../features/article/articles';
import useArticle from '../../features/article/useArticle';
import themes from '../../lib/styles/themes';

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

function SuccessSaveArticleScreen(): React.ReactElement {
  const navigation = useNavigation<
    StackNavigationProp<RootStackParamList & TabParamList>
  >();
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const { lastAddedArticle } = useArticle();
  const iconColor = themes[scheme].colors.typography.point;

  const handlePressClose = () => {
    navigation.navigate('Home', {
      setScrollBottom: true,
      setScrollTop: false,
      openPendingList: false,
    });
  };

  const handlePressNewNotification = () => {
    navigation.replace('NewNotification', {
      article: lastAddedArticle as Article,
      isNewArticle: true,
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
            <Title>새로운 아티클을 추가했어요</Title>
          </Animatable.View>
          <Animatable.View
            animation={fadeInUp}
            delay={350}
          >
            <SubTitle>윌리드와 함께 성장해요! 🌱</SubTitle>
          </Animatable.View>
        </Header>
        <Animatable.View
          animation={fadeInUp}
          delay={500}
        >
          <ArticleCard article={lastAddedArticle} />
        </Animatable.View>
      </Content>
      <Actions>
        <NotificationButtonWrapper>
          <Button
            onPress={handlePressNewNotification}
            variant={ButtonVariant.PrimaryText}
            style={{ paddingHorizontal: 16 }}
          >
            <>
              <NotificationButtonText>알림 설정</NotificationButtonText>
              <NotificationIconWrapper>
                <Svg
                  width="20"
                  height="24"
                  viewBox="0 0 20 24"
                  fill="none"
                >
                  <Path
                    d="M0 3C0 1.34315 1.34315 0 3 0H17C18.6569 0 20 1.34315 20 3V20.5374C20 22.9041 17.3875 24.3389 15.3903 23.0689L11.6097 20.665C10.6274 20.0405 9.37256 20.0405 8.3903 20.665L4.6097 23.0689C2.61247 24.3389 0 22.9041 0 20.5374V3Z"
                    fill={iconColor}
                  />
                </Svg>
                <BellIconWrapper
                  iterationCount="infinite"
                  animation="swing"
                >
                  <Svg
                    width="20"
                    height="24"
                    viewBox="0 0 20 24"
                    fill="none"
                  >
                    <Path
                      d="M14.5 13.5V14H5.5V13.5L6.5 12.5V9.5C6.5 7.95 7.515 6.585 9 6.145C9 6.095 9 6.05 9 6C9 5.73478 9.10536 5.48043 9.29289 5.29289C9.48043 5.10536 9.73478 5 10 5C10.2652 5 10.5196 5.10536 10.7071 5.29289C10.8946 5.48043 11 5.73478 11 6C11 6.05 11 6.095 11 6.145C12.485 6.585 13.5 7.95 13.5 9.5V12.5L14.5 13.5ZM11 14.5C11 14.7652 10.8946 15.0196 10.7071 15.2071C10.5196 15.3946 10.2652 15.5 10 15.5C9.73478 15.5 9.48043 15.3946 9.29289 15.2071C9.10536 15.0196 9 14.7652 9 14.5"
                      fill="#ffffff"
                    />
                  </Svg>
                </BellIconWrapper>
              </NotificationIconWrapper>
            </>
          </Button>
        </NotificationButtonWrapper>
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
  padding: 0 16px 64px 16px;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.typography.primary};
  margin-bottom: 8px;
`;

const SubTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.typography.secondary};
`;

const NotificationButtonWrapper = styled.View`
  margin-bottom: 16px;
  align-items: center;
`;

const NotificationButtonText = styled.Text`
  color: ${(props) => props.theme.colors.typography.point};
  font-size: 17px;
  font-weight: bold;
  margin: 0 8px 0 0;
`;

const NotificationIconWrapper = styled.View``;

const BellIconWrapper = styled(Animatable.View)`
  position: absolute;
  top: 0;
  left: 0;
`;

const Actions = styled.View`
  padding: 16px;
`;

export default SuccessSaveArticleScreen;
