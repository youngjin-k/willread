import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import styled from 'styled-components/native';
import Clipboard from '@react-native-community/clipboard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import urlRegex from 'url-regex';
import { AppState } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Button, { ButtonSize, ButtonVariant } from '../../components/Button';
import { RootStackParamList } from '../../config/Navigation';
import VALID_URL from '../../lib/regex/validUrl';
import useArticle from '../../features/article/useArticle';

function AddFromClipboard() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [clipboardData, setClipboardData] = useState('');
  const [clipboardURL, setClipboardURL] = useState('');
  const { articles } = useArticle();
  const viewRef = useRef<any>();
  const lastClipboardURL = useRef('');

  const getClipboardData = async (appState: string) => {
    if (appState !== 'active') {
      return;
    }

    const data = await Clipboard.getString();
    if (data) {
      setClipboardData(data);
    } else {
      setClipboardData('');
    }
  };

  useEffect(() => {
    getClipboardData('active');
  }, []);

  useFocusEffect(
    useCallback(() => {
      AppState.addEventListener('change', getClipboardData);

      return () => {
        AppState.removeEventListener('change', getClipboardData);
      };
    }, []),
  );

  useEffect(() => {
    const checkClipboard = async () => {
      const URLs = clipboardData.match(urlRegex());

      if (URLs === null) {
        setClipboardURL('');
        return;
      }

      const URL = URLs[0];

      if (URL.match(VALID_URL) === null) {
        setClipboardURL('');
        return;
      }

      if (articles.some(({ url }) => url === URL)) {
        setClipboardURL('');
        return;
      }

      setClipboardURL(URL);
      lastClipboardURL.current = URL;
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
  color: ${(props) => props.theme.colors.typography.title};
  font-weight: bold;
  font-size: 16px;
`;

const URL = styled.Text`
  color: ${(props) => props.theme.colors.typography.secondary};
  font-size: 12px;
  margin-top: 4px;
`;

export default AddFromClipboard;
