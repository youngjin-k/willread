import React from 'react';
import styled from 'styled-components/native';

function ModalHandle(): React.ReactElement {
  return (
    <ModalHandleBlock>
      <Handle />
    </ModalHandleBlock>
  );
}

const ModalHandleBlock = styled.View`
  padding: 8px 0;
  align-items: center;
  justify-content: center;
`;

const Handle = styled.View`
  width: 64px;
  height: 6px;
  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.grey1};
`;

export default ModalHandle;
