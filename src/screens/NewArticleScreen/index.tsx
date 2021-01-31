import React from 'react';

import useArticle from '../../features/article/useArticle';
import haptics from '../../lib/utils/haptics';
import NewArticleFormScreen from './NewArticleFormScreen';
import NoSpaceScreen from './NoSpaceLeftScreen';

function NewArticleScreen(): React.ReactElement {
  const { isPendingListFull } = useArticle();

  if (isPendingListFull) {
    haptics.notification();
    return <NoSpaceScreen />;
  }

  return <NewArticleFormScreen />;
}

export default NewArticleScreen;
