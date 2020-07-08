import React, { ReactElement } from 'react';
import styled from 'styled-components/native';
import FormLabel from '../FormLabel';
import Actions from './Actions';
import Button from './Button';
import { ArticleDraft } from '../../features/articles';

export interface Step4Props {
  article: ArticleDraft;
  setArticle: (article: ArticleDraft) => void;
  nextStep: () => void;
}

function Step4({
  article,
  setArticle,
  nextStep,
}: Step4Props): ReactElement {
  return (
    <>
      <Container>
        <FormLabel>알림 설정</FormLabel>
      </Container>

      <Actions>
        <Button onPress={nextStep}>완료</Button>
      </Actions>
    </>
  );
}

const Container = styled.View`
  justify-content: center;
  padding: 0 16px;
`;
export default Step4;
