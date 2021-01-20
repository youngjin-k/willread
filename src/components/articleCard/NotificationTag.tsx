import React, { useEffect, useRef } from 'react';
import { useColorScheme } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Svg, { Path } from 'react-native-svg';
import styled from 'styled-components/native';

import themes from '../../lib/styles/themes';
import { DisplayItem } from '../../features/article/useArticle';

export interface NotificationTagProps {
  visible: boolean;
  type?: DisplayItem['notificationTagType'];
}

const outAnimation = {
  0: {
    opacity: 1,
    translateY: 0,
  },
  1: {
    opacity: 0,
    translateY: 4,
  },
};

function NotificationTag({ visible, type = 'default' }: NotificationTagProps) {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const color = type === 'default'
    ? themes[scheme].colors.typography.point
    : themes[scheme].colors.danger;
  const viewRef = useRef<any>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!viewRef.current) {
      return;
    }

    if (!visible) {
      viewRef.current.animate(outAnimation, 600);
      return;
    }

    if (isFirstRender.current) {
      viewRef.current.setNativeProps({ style: { opacity: 1 } });
      return;
    }

    viewRef.current.bounceIn(1000, 200);
  }, [visible]);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);

  if (!visible && isFirstRender.current) {
    return null;
  }

  return (
    <NotificationTagBlock>
      <Animatable.View
        ref={viewRef}
        style={{ opacity: 0 }}
      >
        <Svg
          width="20"
          height="24"
          viewBox="0 0 20 24"
          fill="none"
        >
          <Path
            d="M0 3C0 1.34315 1.34315 0 3 0H17C18.6569 0 20 1.34315 20 3V20.5374C20 22.9041 17.3875 24.3389 15.3903 23.0689L11.6097 20.665C10.6274 20.0405 9.37256 20.0405 8.3903 20.665L4.6097 23.0689C2.61247 24.3389 0 22.9041 0 20.5374V3Z"
            fill={color}
          />
        </Svg>

        <BellIconWrapper
          iterationCount={type === 'accent' ? 'infinite' : undefined}
          animation={type === 'accent' ? 'swing' : undefined}
        >
          <Svg
            width="20"
            height="24"
            viewBox="0 0 20 24"
            fill="none"
          >
            <Path
              d="M14.5 13.5V14H5.5V13.5L6.5 12.5V9.5C6.5 7.95 7.515 6.585 9 6.145C9 6.095 9 6.05 9 6C9 5.73478 9.10536 5.48043 9.29289 5.29289C9.48043 5.10536 9.73478 5 10 5C10.2652 5 10.5196 5.10536 10.7071 5.29289C10.8946 5.48043 11 5.73478 11 6C11 6.05 11 6.095 11 6.145C12.485 6.585 13.5 7.95 13.5 9.5V12.5L14.5 13.5ZM11 14.5C11 14.7652 10.8946 15.0196 10.7071 15.2071C10.5196 15.3946 10.2652 15.5 10 15.5C9.73478 15.5 9.48043 15.3946 9.29289 15.2071C9.10536 15.0196 9 14.7652 9 14.5"
              fill="#ffffff"
            />
          </Svg>
        </BellIconWrapper>
      </Animatable.View>
    </NotificationTagBlock>
  );
}

const NotificationTagBlock = styled.View`
  position: absolute;
  top: -2px;
  right: 8px;
`;

const BellIconWrapper = styled(Animatable.View)`
  position: absolute;
  top: 0;
  left: 0;
`;

export default NotificationTag;
