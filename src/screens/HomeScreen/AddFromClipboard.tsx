import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import Clipboard from '@react-native-community/clipboard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import urlRegex from 'url-regex';
import { AppState } from 'react-native';
import Button, { ButtonSize, ButtonVariant } from '../../components/Button';
import { RootStackParamList } from '../../config/Navigation';
import VALID_URL from '../../lib/regex/validUrl';
import useArticle from '../../features/article/useArticle';

function AddFromClipboard() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [clipboardData, setClipboardData] = useState('');
  const [clipBoardURL, setClipBoardURL] = useState('');
  const { articles } = useArticle();

  useEffect(() => {
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

    getClipboardData('active');

    AppState.addEventListener('change', getClipboardData);

    return () => {
      AppState.removeEventListener('change', getClipboardData);
    };
  }, []);

  useEffect(() => {
    const checkClipboard = async () => {
      const URLs = clipboardData.match(urlRegex());

      if (URLs === null) {
        setClipBoardURL('');
        return;
      }

      if (URLs[0].match(VALID_URL) === null) {
        setClipBoardURL('');
        return;
      }

      if (articles.some(({ url }) => url === URLs[0])) {
        setClipBoardURL('');
        return;
      }

      setClipBoardURL(URLs[0]);
    };

    checkClipboard();
  }, [clipboardData, articles]);

  const handlePress = () => {
    navigation.navigate('NewArticle', {
      url: clipBoardURL,
    });
  };

  if (!clipBoardURL) {
    return null;
  }

  return (
    <AddFromClipboardBlock>
      <Button
        variant={ButtonVariant.PrimaryTenderContained}
        size={ButtonSize.Large}
        onPress={handlePress}
      >
        <Content>
          <Title>복사한 URL 추가</Title>
          <URL numberOfLines={1}>
            {clipBoardURL}
          </URL>
        </Content>
      </Button>
    </AddFromClipboardBlock>
  );
}

const AddFromClipboardBlock = styled.View`
  padding: 0 16px 16px 16px;
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
