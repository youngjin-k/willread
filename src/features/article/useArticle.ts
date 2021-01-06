import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  ArticleDraft, addArticle, removeArticle, Article, updateArticle,
} from './articles';

function useArticle() {
  const dispatch = useDispatch();
  const { articles, articleDraft, lastAddedArticle } = useSelector(
    (state: RootState) => state.articles,
  );

  const setRead = (article: Article, read = true) => {
    dispatch(updateArticle({
      id: article.id,
      article: { ...article, read },
    }));
  };

  return {
    articles,
    articleDraft,
    lastAddedArticle,
    addArticle: (draft: ArticleDraft) => dispatch(addArticle(draft)),
    removeArticle: (article: Article) => dispatch(removeArticle(article)),
    setRead,
  };
}

export default useArticle;
