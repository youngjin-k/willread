import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useCallback, useMemo } from 'react';
import Svg, { Path } from 'react-native-svg';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';

import ArticleListCard from '../../components/articleCard/ArticleListCard';
import calculateTimeLeft from '../../components/articleCard/calculateTimeLeft';
import BottomModal from '../../components/BottomModal';
import Button, { ButtonVariant } from '../../components/Button';
import Line from '../../components/Line';
import { RootStackParamList, TabParamList } from '../../config/Navigation';
import { Article } from '../../features/article/articles';
import useArticle from '../../features/article/useArticle';
import useTheme from '../../lib/styles/useTheme';
import willreadToast from '../../lib/willreadToast';

export interface ArticleMenuProps {
  article: Article;
  isVisible: boolean;
  onClose: () => void;
}

function ArticleMenu({
  article,
  isVisible,
  onClose,
}: ArticleMenuProps): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList & TabParamList>>();
  const {
    readArticle,
    extendExpiryDate,
  } = useArticle();

  const timeLeft = useMemo(() => calculateTimeLeft(article.expiredAt), [article]);

  const handleReadNowPress = () => {
    onClose();
    setTimeout(() => {
      readArticle(article);
    }, 100);
  };

  const handleExtendExpiryDatePress = () => {
    onClose();
    extendExpiryDate(article);
    willreadToast.showSimple('보관 기간을 연장했어요.');
    navigation.navigate('Home', {
      setScrollBottom: true,
      setScrollTop: false,
    });
  };

  return (
    <BottomModal
      isVisible={isVisible}
      onClose={onClose}
    >
      <ArticleCardWrapper>
        {timeLeft && <Title>{timeLeft.detailLabel}</Title>}
        <ArticleListCard article={article} />
      </ArticleCardWrapper>

      <Line />

      <MenuList>
        <ButtonWrapper>
          <Button
            variant={ButtonVariant.DefaultText}
            onPress={handleReadNowPress}
          >
            <ButtonContent>
              <ButtonIcon name="book-open" />
              <ButtonText>바로 읽기</ButtonText>
            </ButtonContent>
          </Button>
        </ButtonWrapper>

        <ButtonWrapper>
          <Button
            variant={ButtonVariant.DefaultText}
            onPress={handleExtendExpiryDatePress}
          >
            <ButtonContent>
              <MoreTimeIcon />
              <ButtonText>보관 기간 연장</ButtonText>
            </ButtonContent>
          </Button>
        </ButtonWrapper>
      </MenuList>
    </BottomModal>
  );
}

const ArticleCardWrapper = styled.View`
  padding: 0 0 8px 0;
`;

const Title = styled.Text`
  font-weight: bold;
  font-size: 16px;
  color: ${(props) => props.theme.colors.typography.point};
  margin: 16px 0 16px 16px;
  font-weight: bold;
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

const ButtonIcon = styled(Icon)`
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.primary};
  margin-right: 16px;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.typography.primary};
  flex: 1;
`;

function MoreTimeIcon() {
  const theme = useTheme();
  return (
    <Svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      style={{ marginRight: 14, marginBottom: 1 }}
    >
      <Path
        d="M10.75 8C10.34 8 10 8.34 10 8.75V13.44C10 13.79 10.18 14.11 10.47 14.29L14.11 16.53C14.44 16.73 14.87 16.64 15.08 16.32C15.31 15.98 15.2 15.52 14.85 15.31L11.5 13.3V8.75C11.5 8.34 11.16 8 10.75 8Z"
        fill={theme.colors.typography.primary}
      />
      <Path
        d="M18.9242 12C18.3957 12 18 12.4716 18 13V13C18 16.9 14.9 20 11 20C7.1 20 4 16.9 4 13C4 9.1 7.1 6 11 6C11.2474 6 11.491 6.01249 11.7305 6.03703C12.3729 6.10286 13 5.63929 13 4.99352V4.99352C13 4.54625 12.6927 4.15214 12.2499 4.08872C11.8424 4.03035 11.425 4 11 4C6 4 2 8 2 13C2 18 6 22 11 22C16 22 20 18 20 13C20 12.9911 19.9987 12.9433 19.9961 12.8717C19.9781 12.3734 19.565 12 19.0664 12H18.9242Z"
        fill={theme.colors.typography.primary}
      />
      <Path
        d="M22 5H20V3C20 2.45 19.55 2 19 2C18.45 2 18 2.45 18 3V5H16C15.45 5 15 5.45 15 6C15 6.55 15.45 7 16 7H18V9C18 9.55 18.45 10 19 10C19.55 10 20 9.55 20 9V7H22C22.55 7 23 6.55 23 6C23 5.45 22.55 5 22 5Z"
        fill={theme.colors.typography.primary}
      />
    </Svg>
  );
}
export default ArticleMenu;
