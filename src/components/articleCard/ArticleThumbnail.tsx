import React, { useMemo, useState } from 'react';
import styled, { css } from 'styled-components/native';
import FastImage from 'react-native-fast-image';
import fallbackImage from '../../../assets/fallback.png';

export interface ArticleThumbnailProps {
  size?: 'mini' | 'fullWidth';
  uri?: string;
}

function ArticleThumbnail({ size = 'mini', uri }: ArticleThumbnailProps) {
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleImageError = () => {
    setImageLoadError(true);
  };

  const source = useMemo(
    () => (uri && !imageLoadError
      ? {
        uri,
      }
      : fallbackImage),
    [uri, imageLoadError],
  );

  return (
    <ArticleThumbnailBlock
      size={size}
      source={source}
      onError={handleImageError}
    />
  );
}

const ArticleThumbnailBlock = styled(FastImage)<{
  size: ArticleThumbnailProps['size'];
}>`
  ${(props) => (props.size === 'mini'
    ? css`
          width: 96px;
          height: 80px;
        `
    : css`
          width: 100%;
          aspect-ratio: ${1.9 / 1};
        `)}
  border-radius: 16px;

  ${(props) => props.theme.dark
    && css`
      opacity: 0.8;
    `}
`;

export default ArticleThumbnail;
