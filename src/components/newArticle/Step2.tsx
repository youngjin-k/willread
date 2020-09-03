import React, { ReactElement, useState, useCallback } from 'react';
import styled, { css } from 'styled-components/native';
import { useColorScheme, ColorSchemeName } from 'react-native-appearance';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, useWindowDimensions, View } from 'react-native';
import TextInput from '../TextInput';
import Actions from './Actions';
import Button from './Button';
import useArticle from '../../features/article/useArticle';

export interface Step2Props {
    nextStep: () => void;
}

function Step2({ nextStep }: Step2Props): ReactElement {
  const { articleDraft, setArticleDraft } = useArticle();
  const windowWidth = useWindowDimensions().width;
  const scheme = useColorScheme();
  const [editTitle, setEditTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState(articleDraft.title);

  const updateTitle = useCallback(() => {
    setArticleDraft({
      ...articleDraft,
      title: titleDraft,
    });
    setEditTitle(false);
  }, [articleDraft, setArticleDraft, titleDraft]);

  return (
    <>
      <Container>
        <View style={{ flex: 1, justifyContent: 'center' }} />
        <ThumbnailWrapper windowWidth={windowWidth}>
          <Thumbnail
            source={{
              uri: articleDraft.image,
            }}
            scheme={scheme}
            resizeMode="cover"
          />
        </ThumbnailWrapper>
        {editTitle
          ? (
            <EditContainer>
              <TextInput
                defaultValue={articleDraft.title}
                onChangeText={(text) => setTitleDraft(text)}
                autoFocus
              />
              <EditActions>
                <TouchableOpacity onPress={() => setEditTitle(false)}>
                  <CancelText>취소</CancelText>
                </TouchableOpacity>
                <TouchableOpacity onPress={updateTitle}>
                  <SaveText>변경</SaveText>
                </TouchableOpacity>
              </EditActions>
            </EditContainer>
          ) : (
            <TouchableOpacity onPress={() => setEditTitle(true)}>
              <Title>
                {articleDraft.title}
                <EditIcon name="edit-3" />
              </Title>
            </TouchableOpacity>
          )}
      </Container>

      <Actions>
        <Button onPress={nextStep}>다음</Button>
      </Actions>
    </>
  );
}

const Container = styled.ScrollView`
  padding: 0 16px;
  flex: 1;
`;

const ThumbnailWrapper = styled.View<{windowWidth: number}>`
  width: 100%;
  height: ${(props) => (props.windowWidth - 32) * 0.53};
  border-radius: 16px;
  background-color: ${(props) => props.theme.colors.secondary};
  margin: 0 0 16px 0;
`;

const Thumbnail = styled.Image<{scheme: ColorSchemeName}>`
  width: 100%;
  height: 100%;
  border-radius: 16px;

  ${(props) => props.scheme === 'dark' && css`
    opacity: 0.8;
  `}
`;

const Title = styled.Text`
  font-size: 21px;
  color: ${(props) => props.theme.colors.typography.title};
  font-weight: bold;
`;

const EditIcon = styled(Feather)`
  font-size: 19px;
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;
`;

const EditContainer = styled.View``;

const EditActions = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const CancelText = styled.Text`
  font-size: 14px;
  padding: 16px;
  color: ${(props) => props.theme.colors.grey2};
`;

const SaveText = styled.Text`
  font-size: 14px;
  padding: 16px;
  color: ${(props) => props.theme.colors.primary};
  font-weight: bold;
`;

export default Step2;
