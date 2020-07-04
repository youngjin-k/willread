import React, { ReactElement } from 'react';
import styled from 'styled-components/native';

export interface LineProps {
    padding?: number;
}

function Line({ padding = 16 }: LineProps): ReactElement {
  return (
    <LineBlock padding={padding}>
      <Hr />
    </LineBlock>
  );
}

const LineBlock = styled.View<LineProps>`
    width: 100%;
    height: 1px;
    padding: 0 ${(props) => props.padding}px;
`;

const Hr = styled.View`
    width: 100%;
    height: 1px;
    background-color: ${(props) => props.theme.colors.border};
`;

export default Line;
