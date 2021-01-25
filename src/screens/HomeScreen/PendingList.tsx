import React from 'react';
import styled from 'styled-components/native';

import ArticleListCard from '../../components/articleCard/ArticleListCard';
import BottomModal from '../../components/BottomModal';
import Line from '../../components/Line';
import useArticle from '../../features/article/useArticle';

export interface PendingListProps {
  isVisible: boolean;
  onClose: () => void;
}

function PendingList({ isVisible, onClose }: PendingListProps) {
  const { pendingList } = useArticle();

  return (
    <BottomModal
      isVisible={isVisible}
      onClose={onClose}
    >
      <PendingListBlock>
        <Header>
          <Title>등록 대기 목록</Title>
        </Header>
        <Line />
        <List showsVerticalScrollIndicator={false}>
          {pendingList.map((article) => (
            <ArticleListCard
              key={article.id}
              article={article}
              onPress={() => null}
            />
          ))}
        </List>
      </PendingListBlock>
    </BottomModal>
  );
}

const PendingListBlock = styled.View``;

const Header = styled.View`
  padding: 16px;
`;

const Title = styled.Text`
  font-size: 22px;
  color: ${(props) => props.theme.colors.typography.primary};
  font-weight: bold;
`;

const List = styled.ScrollView`
  padding: 8px 0;
  max-height: ${96 * 3.5}px;
`;

export default PendingList;
