import React, { useMemo, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';
import Alert from '../../components/Alert';

import ArticleListCard from '../../components/articleCard/ArticleListCard';
import calculateTimeLeft from '../../components/articleCard/calculateTimeLeft';
import BottomModal from '../../components/BottomModal';
import Button, { ButtonVariant } from '../../components/Button';
import Line from '../../components/Line';
import { Article } from '../../features/article/articles';
import useArticle from '../../features/article/useArticle';

export interface PendingListProps {
  isVisible: boolean;
  onClose: () => void;
}

function PendingList({ isVisible, onClose }: PendingListProps) {
  const { pendingList, removePendingList } = useArticle();
  const [selectedItems, setSelectedItems] = useState<Article[]>([]);
  const [visibleRemoveConfirm, setVisibleRemoveConfirm] = useState(false);

  const toggleSelectedItem = (article: Article) => {
    setSelectedItems((oldList) => {
      if (oldList.some((_article) => _article === article)) {
        return oldList.filter((_article) => _article !== article);
      }
      return oldList.concat(article);
    });
  };

  const handlePress = (article: Article) => {
    toggleSelectedItem(article);
  };

  const isSelected = (article: Article) => selectedItems.some((_article) => _article === article);

  const handleConfirmRemovePress = () => {
    closeRemoveConfirm();
    selectedItems.forEach((article) => {
      removePendingList(article);
    });
    setSelectedItems([]);
  };

  const openRemoveConfirm = () => {
    setVisibleRemoveConfirm(true);
  };

  const closeRemoveConfirm = () => {
    setVisibleRemoveConfirm(false);
  };

  const displayItems = useMemo(() => pendingList.map((article) => ({
    article,
    timeLeft: calculateTimeLeft(article.expiredAt),
  })), [pendingList]);

  return (
    <BottomModal
      isVisible={isVisible}
      onClose={onClose}
      useSafeAreaView={false}
    >
      <PendingListBlock>
        <Header>
          <Title>등록 대기 목록</Title>
          {selectedItems.length > 0 && (
            <Button
              variant={ButtonVariant.DefaultText}
              style={{ paddingHorizontal: 16 }}
              onPress={openRemoveConfirm}
            >
              <TrashIcon name="trash" />
            </Button>
          )}
        </Header>
        <Line />
        <List
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 8 }}
        >
          {displayItems.map(({ article, timeLeft }) => (
            <ArticleListCard
              key={article.id}
              article={article}
              timeLeft={timeLeft}
              onPress={handlePress}
              selected={isSelected(article)}
            />
          ))}
        </List>

        {displayItems.length === 0 && (
          <EmptyContent>
            <EmptyContentLabel>등록 대기 목록이 비어있어요.</EmptyContentLabel>
          </EmptyContent>
        )}
      </PendingListBlock>

      <Alert
        visible={visibleRemoveConfirm}
        title={`${selectedItems.length}개 항목이 선택되었어요.`}
        message="선택한 항목을 삭제할까요?"
        onClose={closeRemoveConfirm}
        buttons={[
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '삭제',
            style: 'destructive',
            onPress: handleConfirmRemovePress,
          },
        ]}
      />
    </BottomModal>
  );
}

const PendingListBlock = styled.View``;

const Header = styled.View`
  height: 64px;
  padding: 0 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 22px;
  color: ${(props) => props.theme.colors.typography.primary};
  font-weight: bold;
`;

const TrashIcon = styled(Icon)`
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.primary};
`;

const List = styled.ScrollView`
  max-height: ${96 * 3.5}px;
`;

const EmptyContent = styled.View`
  height: 96px;
  justify-content: center;
  align-items: center;
`;

const EmptyContentLabel = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.typography.secondary};
`;

export default PendingList;
