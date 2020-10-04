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
      <ModalHandle />
      {children}
    </BottomModalContainerBlock>
  );
}

const BottomModalContainerBlock = styled.SafeAreaView`
  background-color: ${(props) => props.theme.colors.background};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding-bottom: 16px;
`;

export default BottomModalContainer;
