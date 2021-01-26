import React from 'react';

import useArticle from '../../features/article/useArticle';
import NewArticleFormScreen from './NewArticleFormScreen';
import NoSpaceScreen from './NoSpaceLeftScreen';

function NewArticleScreen(): React.ReactElement {
  const { isPendingListFull } = useArticle();

  if (isPendingListFull) {
    return <NoSpaceScreen />;
  }

  return <NewArticleFormScreen />;
}

export default NewArticleScreen;
