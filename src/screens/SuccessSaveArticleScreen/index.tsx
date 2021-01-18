import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';

import Button, { ButtonSize, ButtonVariant } from '../../components/Button';
import { RootStackParamList, TabParamList } from '../../config/Navigation';
import { Article } from '../../features/article/articles';
import useArticle from '../../features/article/useArticle';

function SuccessSaveArticleScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList & TabParamList>>();
  const { lastAddedArticle } = useArticle();

  const handlePressClose = () => {
    navigation.navigate('Home', {
      setScrollBottom: true,
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
        <IconWrapper>
          <CheckIcon name="check" />
        </IconWrapper>
        <View style={{ alignItems: 'center' }}>
          <Title>윌리드 등록 완료</Title>
          <SubTitle>윌리드와 함께 성장하세요</SubTitle>
        </View>
        <NotificationButtonWrapper>
          <Button
            onPress={handlePressNewNotification}
            label="알림을 받고 싶어요"
            variant={ButtonVariant.PrimaryTenderContained}
            style={{ paddingHorizontal: 16 }}
          />
        </NotificationButtonWrapper>

        <Actions>
          <Button
            onPress={handlePressClose}
            label="완료"
            size={ButtonSize.Large}
          />
        </Actions>
      </Content>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  padding: 0 16px 72px 16px;
  justify-content: center;
  align-items: center;
`;

const IconWrapper = styled.View`
  width: 96px;
  height: 96px;
  border-radius: 48px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.primary};
  margin-bottom: 32px;
  padding-top: 12px;
  box-shadow: 0 3px 17px rgba(0, 0, 0, 0.24);
`;

const CheckIcon = styled(Icon)`
  font-size: 60px;
  color: #fff;
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
  margin-top: 16px;
`;

const Actions = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  height: ${64 + 16 + 16}px;
`;

export default SuccessSaveArticleScreen;
