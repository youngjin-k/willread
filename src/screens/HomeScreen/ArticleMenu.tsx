import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { Share } from 'react-native';
import styled from 'styled-components/native';

import ArticleListCard from '../../components/articleCard/ArticleListCard';
import Button, { ButtonVariant } from '../../components/Button';
import Line from '../../components/Line';
import { RootStackParamList } from '../../config/Navigation';
import { Article } from '../../features/article/articles';
import useArticle from '../../features/article/useArticle';
import BottomModalContainer from '../BottomModalContainer';

export interface ArticleMenuProps {
  article: Article;
  onClose: () => void;
}

function ArticleMenu({ article, onClose }: ArticleMenuProps): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { removeArticle } = useArticle();

  const handlePressNewNotification = useCallback(() => {
    onClose();
    navigation.navigate('NewNotification', {
      article,
    });
  }, [navigation, article, onClose]);

  const handlePressRemoveArticle = useCallback(() => {
    onClose();
    removeArticle(article);
  }, [article, removeArticle, onClose]);

  const handlePressSharing = useCallback(() => {
    Share.share({
      message: `${article.title} - ${article.uri}`,
    });
  }, [article]);

  return (
    <BottomModalContainer>
      <ArticleCardWrapper>
        <ArticleListCard article={article} />
      </ArticleCardWrapper>

      <Line />

      <MenuList>
        <ButtonWrapper>
          <Button variant={ButtonVariant.DefaultText}>
            <ButtonContent>
              <ButtonIcon name="tag" />
              <ButtonText>태그 변경</ButtonText>
            </ButtonContent>
          </Button>
        </ButtonWrapper>

        <ButtonWrapper>
          <Button variant={ButtonVariant.DefaultText} onPress={handlePressSharing}>
            <ButtonContent>
              <ButtonIcon name="share" />
              <ButtonText>공유</ButtonText>
            </ButtonContent>
          </Button>
        </ButtonWrapper>

        <ButtonWrapper>
          <Button variant={ButtonVariant.DefaultText}>
            <ButtonContent>
              <ButtonIcon name="inbox" />
              <ButtonText>보관함으로 이동</ButtonText>
            </ButtonContent>
          </Button>
        </ButtonWrapper>

        <ButtonWrapper>
          <Button variant={ButtonVariant.DefaultText} onPress={handlePressNewNotification}>
            <ButtonContent>
              <ButtonIcon name="bell" />
              <ButtonText>알림 설정</ButtonText>
            </ButtonContent>
          </Button>
        </ButtonWrapper>

        <ButtonWrapper>
          <Button variant={ButtonVariant.DefaultText} onPress={handlePressRemoveArticle}>
            <ButtonContent>
              <ButtonIcon name="trash" />
              <ButtonText>삭제</ButtonText>
            </ButtonContent>
          </Button>
        </ButtonWrapper>
      </MenuList>
    </BottomModalContainer>
  );
}

const ArticleCardWrapper = styled.View`
  padding: 0 0 8px 0;
`;

const MenuList = styled.View`
  margin-top: 8px;
  padding: 0 16px;
`;

const ButtonWrapper = styled.View`
  margin-top: 8px;
`;

const ButtonContent = styled.View`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 16px;
`;

const ButtonIcon = styled(Feather)`
  font-size: 18px;
  color: ${(props) => props.theme.colors.typography.title};
  margin-right: 16px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.typography.title};
  flex: 1;
`;

export default ArticleMenu;
