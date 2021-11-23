import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import FastImage from 'react-native-fast-image';
import styled from 'styled-components/native';
import bookshelfFull from '../../../assets/bookshelf-full.png';
import BottomCtaContainer from '../../components/BottomCtaContainer';

import Button, { ButtonSize } from '../../components/Button';
import { RootStackParamList, TabParamList } from '../../config/Navigation';

function NoSpaceScreen() {
  const navigation = useNavigation<
    StackNavigationProp<RootStackParamList & TabParamList>
  >();

  const handlePressClose = () => {
    navigation.pop();
  };

  return (
    <Container>
      <Content>
        <ImageWrapper>
          <Image source={bookshelfFull} />
        </ImageWrapper>
        <Title>더 이상 등록할 수 없어요.</Title>
        <SubTitle>모든 공간이 가득 찼어요.</SubTitle>
      </Content>

      <BottomCtaContainer>
        <Button
          onPress={handlePressClose}
          label="확인"
          size={ButtonSize.Large}
        />
      </BottomCtaContainer>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Content = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ImageWrapper = styled.View`
  margin: 64px 0 24px 0;
`;

const Image = styled(FastImage)`
  width: 140px;
  height: 140px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.typography.primary};
  margin-bottom: 8px;
`;

const SubTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: ${(props) => props.theme.colors.typography.secondary};
`;

export default NoSpaceScreen;
