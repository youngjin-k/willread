import React, { useState, useRef } from 'react';
import {
  useColorScheme, TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import { WebViewProgressEvent } from 'react-native-webview/lib/WebViewTypes';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../config/Navigation';
import ProgressBar from '../components/ProgressBar';

function ViewerScreen(): React.ReactElement {
  const route = useRoute<RouteProp<RootStackParamList, 'Viewer'>>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [progress, setProgress] = useState(0);
  const [loadEnd, setLoadEnd] = useState(false);
  const [loadStart, setLoadStart] = useState(false);
  const webViewRef = useRef(null);

  const handleLoadProgress = ({ nativeEvent }: WebViewProgressEvent) => {
    setProgress(nativeEvent.progress);
  };

  const handleLoadEnd = () => {
    setLoadEnd(true);
  };

  const handleLoadStart = () => {
    setLoadStart(true);
  };

  return (
    <Container>
      <Header>
        <HeaderButton onPress={() => navigation.pop()}>
          <HeaderIcon name="chevron-left" />
        </HeaderButton>
        <Title numberOfLines={1}>
          {route.params.item.title}
        </Title>
        <HeaderButton>
          <HeaderIcon name="more-vertical" />
        </HeaderButton>
        <ProgressBarWrapper>
          {(loadStart && !loadEnd) && <ProgressBar progress={progress} />}
        </ProgressBarWrapper>
      </Header>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ uri: route.params.item.uri }}
        onLoadProgress={handleLoadProgress}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
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
