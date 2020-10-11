import React, { useState, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../config/Navigation';
import Step1 from './Step1';
import Step2 from './Step2';
import Complete from './Complete';
import Button, { ButtonVariant, ButtonSize } from '../../components/Button';

function NewArticleScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(0);
  const prevStep = () => {
    setStep((currentStep) => currentStep - 1);
  };

  const nextStep = useCallback(() => {
    setStep(step + 1);
  }, [step]);

  return (
    <Container>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1, justifyContent: 'space-between' }}
      >
        <Header>
          {[1].includes(step) && (
            <PrevButtonWrapper>
              <Button
                onPress={prevStep}
                variant={ButtonVariant.PrimaryText}
                size={ButtonSize.Small}
                label="이전"
              />
            </PrevButtonWrapper>
          )}
          <HeaderTitle>새로운 윌리드</HeaderTitle>
          <CloseButtonWrapper>
            <Button
              onPress={() => navigation.pop()}
              variant={ButtonVariant.DefaultText}
              size={ButtonSize.Small}
            >
              <BackIcon name="x" />
            </Button>
          </CloseButtonWrapper>
        </Header>

        <Content>
          {step === 0 && <Step1 nextStep={nextStep} />}
          {step === 1 && <Step2 nextStep={nextStep} />}
          {step === 2 && <Complete />}
        </Content>
      </KeyboardAvoidingView>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Header = styled.View`
  height: 56px;
  padding: 0 16px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const PrevButtonWrapper = styled.View`
  padding: 0 16px;
  height: 56px;
  width: ${48 + 32}px;
  position: absolute;
  top: 0;
  left: 0;
  justify-content: center;
`;

const CloseButtonWrapper = styled.View`
  padding: 0 16px;
  height: 56px;
  width: ${32 + 32}px;
  position: absolute;
  top: 0;
  right: 0;
  justify-content: center;
`;

const BackIcon = styled(Feather)`
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.title};
`;

const HeaderTitle = styled(Text)`
  font-size: 18px;
  color: ${(props) => props.theme.colors.typography.title};
  font-weight: bold;
`;

const Content = styled.View`
  flex: 1;
  padding-bottom: 72px;
`;

export default NewArticleScreen;
