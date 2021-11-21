import React from 'react';
import styled from 'styled-components/native';

interface CustomToastProps {
  text1?: string;
  inProgress: boolean;
  isVisible: boolean;
}

function ToastTemplate({ text1, isVisible, inProgress }: CustomToastProps) {
  return (
    <ToastTemplateBlock>
      <Toast
        style={{
          shadowColor: 'rgba(0, 0, 0, 0.16)',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.55,
          shadowRadius: 16,

          elevation: 25,
        }}
        isVisible={isVisible || inProgress}
      >
        <ToastText>{text1}</ToastText>
      </Toast>
    </ToastTemplateBlock>
  );
}

const ToastTemplateBlock = styled.View`
  padding: 0 16px;
`;

const Toast = styled.View<{ isVisible: boolean }>`
  flex: 1;
  border-radius: 8px;
  background-color: ${(props) => props.theme.colors.backgroundElevated};
  padding: 16px 20px;
  justify-content: center;
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
`;

const ToastText = styled.Text`
  font-size: 13px;
  color: ${(props) => props.theme.colors.typography.primary};
  font-weight: bold;
`;

export const toastConfig = {
  willread: (props: CustomToastProps) => <ToastTemplate {...props} />,
};

export default ToastTemplate;
