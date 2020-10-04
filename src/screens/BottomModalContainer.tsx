import React from 'react';
import styled from 'styled-components/native';
import ModalHandle from '../components/ModalHandle';

export interface BottomModalContainerProps {
  children: React.ReactNode | React.ReactNode[];
}

function BottomModalContainer({
  children,
}: BottomModalContainerProps): React.ReactElement {
  return (
    <BottomModalContainerBlock>
      <Main>
        <ModalHandle />
        {children}
      </Main>
    </BottomModalContainerBlock>
  );
}

const BottomModalContainerBlock = styled.View`
  align-items: center;
`;

const Main = styled.SafeAreaView`
  background-color: ${(props) => props.theme.colors.background};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding-bottom: 16px;
  max-width: 560px;
  width: 100%;
`;

export default BottomModalContainer;
