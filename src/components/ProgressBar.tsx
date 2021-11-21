import React, { ReactElement } from 'react';
import styled from 'styled-components/native';

export interface ProgressProps {
    progress: number;
}

function ProgressBar({ progress = 0 }: ProgressProps): ReactElement {
  return (
    <ProgressBarBlock>
      <Bar progress={progress} />
    </ProgressBarBlock>
  );
}

const ProgressBarBlock = styled.View`
    width: 100%;
    height: 2px;
    background-color: #C0B6FF;
`;

const Bar = styled.View<ProgressProps>`
    width: ${(props) => props.progress * 100}%;
    height: 2px;
    background-color: ${(props) => props.theme.colors.primary};
`;

export default ProgressBar;
