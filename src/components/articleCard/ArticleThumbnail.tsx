import React, { useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import FastImage, { ImageStyle } from 'react-native-fast-image';

import fallbackImage from '../../../assets/fallback.png';

const miniStyle: ImageStyle = {
  width: 96,
  height: 80,
};

const fullWidthStyle: ImageStyle = {
  width: '100%',
  aspectRatio: 1.9,
};

export interface ArticleThumbnailProps {
  size?: 'mini' | 'fullWidth';
  uri?: string;
}

function ArticleThumbnail({ size = 'mini', uri }: ArticleThumbnailProps) {
  const [imageLoadError, setImageLoadError] = useState(false);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

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
    <FastImage
      source={source}
      onError={handleImageError}
      style={{
        borderRadius: 16,
        opacity: isDark ? 0.8 : 1,
        ...size === 'mini' ? miniStyle : fullWidthStyle,
      }}
    />
  );
}

export default ArticleThumbnail;
