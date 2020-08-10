import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setArticleDraft, ArticleDraft } from './articles';

function useArticle() {
  const dispatch = useDispatch();
  const {
    articles,
    articleDraft,
    lastAddedArticle,
  } = useSelector((state: RootState) => state.articles);

  return {
    articles,
    articleDraft,
    lastAddedArticle,
    setArticleDraft: (draft: ArticleDraft) => dispatch(setArticleDraft(draft)),
  };
}

export default useArticle;
