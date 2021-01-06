import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  ArticleDraft, addArticle, removeArticle, Article,
} from './articles';

function useArticle() {
  const dispatch = useDispatch();
  const { articles, articleDraft, lastAddedArticle } = useSelector(
    (state: RootState) => state.articles,
  );

  return {
    articles,
    articleDraft,
    lastAddedArticle,
    addArticle: (draft: ArticleDraft) => dispatch(addArticle(draft)),
    removeArticle: (article: Article) => dispatch(removeArticle(article)),
  };
}

export default useArticle;
