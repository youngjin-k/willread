import React, { useState } from 'react';
import {
  useColorScheme, TouchableOpacity, ProgressBarAndroid, ProgressViewIOS, Platform,
} from 'react-native';
import styled from 'styled-components/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { RootStackParamList } from '../config/Navigation';
import ProgressBar from '../components/ProgressBar';

function ViewerScreen(): React.ReactElement {
  const scheme = useColorScheme();
  const route = useRoute<StackNavigationProp<RootStackParamList>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [progress, setProgress] = useState(0);

  const handleLoadProgress = ({ nativeEvent }) => {
    setProgress(nativeEvent.progress);
  };

  return (
    <Container>
      <Header>
        <HeaderButton onPress={() => navigation.pop()}>
          <HeaderIcon name="chevron-left" />
        </HeaderButton>
        <Title
          numberOfLines={1}
        >
          {route.params.item.title}
        </Title>
        <HeaderButton>
          <HeaderIcon name="more-vertical" />
        </HeaderButton>
        <ProgressBarWrapper>
          {progress < 1
      && <ProgressBar progress={progress} />}
        </ProgressBarWrapper>
      </Header>
      <WebView
        originWhitelist={['*']}
        source={{ uri: route.params.item.URI }}
        onLoadProgress={handleLoadProgress}
      />
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Header = styled.View`
  height: 56px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const HeaderButton = styled(TouchableOpacity)`
  width: 56px;
  height: 56px;
  align-items: center;
  justify-content: center;
`;

const HeaderIcon = styled(Feather)`
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.title};
`;

const Title = styled.Text`
  flex: 1;
  font-size: 18px;
  color: ${(props) => props.theme.colors.typography.title};
`;

const ProgressBarWrapper = styled.View`
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
`;

const Text = styled.Text`
  color: ${(props) => props.theme.colors.typography.title};
`;

const Button = styled.Button``;

export default ViewerScreen;
