import Clipboard from '@react-native-community/clipboard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { AppState } from 'react-native';
import * as Animatable from 'react-native-animatable';
import styled from 'styled-components/native';
import { throttle } from 'throttle-debounce';

import Button, { ButtonSize, ButtonVariant } from '../../components/Button';
import { RootStackParamList } from '../../config/Navigation';
import useArticle from '../../features/article/useArticle';
import extractUrl from '../../lib/utils/extractUrl';

function AddFromClipboard() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [clipboardData, setClipboardData] = useState('');
  const [clipboardURL, setClipboardURL] = useState('');
  const { articles } = useArticle();
  const viewRef = useRef<any>();
  const lastClipboardURL = useRef('');

  const getClipboardData = useRef(
    throttle(5000, true, async (appState: string) => {
      if (appState !== 'active') {
        return;
      }

      const data = await Clipboard.getString();
      if (data) {
        setClipboardData(data);
      } else {
        setClipboardData('');
      }
    }),
  );

  useEffect(() => {
    getClipboardData.current('active');
  }, []);

  useFocusEffect(
    useCallback(() => {
      const handleFocusChange = getClipboardData.current;

      const subscription = AppState.addEventListener('change', handleFocusChange);

      return () => {
        subscription.remove();
      };
    }, []),
  );

  useEffect(() => {
    const checkClipboard = async () => {
      const url = extractUrl(clipboardData);

      if (!url) {
        setClipboardURL('');
        return;
      }

      if (articles.some((article) => article.url === url)) {
        setClipboardURL('');
        return;
      }

      setClipboardURL(url);
      lastClipboardURL.current = url;
    };

    checkClipboard();
  }, [clipboardData, articles]);

  const handlePress = () => {
    navigation.navigate('NewArticle', {
      url: clipboardURL,
    });
  };

  const playInAnimation = () => {
    if (!viewRef.current) {
      return;
    }

    viewRef.current.animate({
      0: {
        opacity: 0,
        height: 0,
      },
      0.5: {
        opacity: 0,
        height: 80,
      },
      1: {
        opacity: 1,
        height: 80,
      },
    });
  };

  const playOutAnimation = async () => {
    if (!viewRef.current) {
      return;
    }

    await viewRef.current.animate({
      0: {
        opacity: 1,
        height: 80,
      },
      0.5: {
        opacity: 0,
        height: 80,
      },
      1: {
        opacity: 0,
        height: 0,
      },
    });
  };

  useEffect(() => {
    if (clipboardURL) {
      playInAnimation();
      return;
    }

    if (lastClipboardURL.current) {
      playOutAnimation();
    }
  }, [clipboardURL]);

  return (
    <AnimatableView ref={viewRef}>
      <AddFromClipboardBlock>
        <Button
          variant={ButtonVariant.PrimaryTenderContained}
          size={ButtonSize.Large}
          onPress={handlePress}
        >
          <Content>
            <Title>{clipboardURL && '복사한 URL 추가'}</Title>
            <URL numberOfLines={1}>{clipboardURL}</URL>
          </Content>
        </Button>
      </AddFromClipboardBlock>
    </AnimatableView>
  );
}

const AnimatableView = styled(Animatable.View)`
  opacity: 0;
  height: 0;
  overflow: hidden;
`;

const AddFromClipboardBlock = styled.View`
  margin: 8px 0;
  padding: 0 16px;
  height: 64px;
`;

const Content = styled.View`
  flex-direction: column;
  flex: 1;
  padding: 0 16px;
`;

const Title = styled.Text`
  color: ${(props) => props.theme.colors.typography.primary};
  font-weight: bold;
  font-size: 16px;
`;

const URL = styled.Text`
  color: ${(props) => props.theme.colors.typography.secondary};
  font-size: 12px;
  margin-top: 4px;
`;

export default AddFromClipboard;
