import React, { useState, useCallback } from 'react';
import { Feather } from '@expo/vector-icons';
import {
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../config/Navigation';
import Step1 from '../components/newArticle/Step1';
import Step2 from '../components/newArticle/Step2';
import Step3 from '../components/newArticle/Step3';
import { CategoryColors } from '../features/homeCategoryFilters';
import Step4 from '../components/newArticle/Step4';
import { ArticleDraft } from '../features/article/articles';
import Complete from '../components/newArticle/Complete';
import Button, { ButtonVariant, ButtonSize } from '../components/Button';

function NewArticleScreen(): React.ReactElement {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [step, setStep] = useState(0);

  const [draft, setDraft] = useState<ArticleDraft>({
    uri:
      'https://medium.com/daangn/%EC%84%9C%EB%B9%84%EC%8A%A4-%EC%A4%91%EB%8B%A8%EC%97%86%EC%9D%B4-%EB%A3%A8%EB%B9%84-%EB%B2%84%EC%A0%84-2-6-%EC%97%85%EA%B7%B8%EB%A0%88%EC%9D%B4%EB%93%9C-%ED%95%98%EA%B8%B0-db8991c19050',
    // uri: '',
    title: '',
    description: '',
    image: '',
    categoryColor: CategoryColors.RED,
    minutesToRead: 0,
  });

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
          {[1, 2, 3].includes(step) && (
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
          {step === 2 && <Step3 nextStep={nextStep} />}
          {step === 3 && <Step4 nextStep={nextStep} />}
          {step === 4 && <Complete />}
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
