import React, { ReactElement } from 'react';
import styled, { css } from '@emotion/native';

export interface LineProps {
  padding?: number;
  marginTop?: number;
  marginBottom?: number;
}

function Line({
  padding = 16,
  marginTop = 0,
  marginBottom = 0,
}: LineProps): ReactElement {
  return (
    <LineBlock
      padding={padding}
      marginTop={marginTop}
      marginBottom={marginBottom}
    >
      <Hr />
    </LineBlock>
  );
}

const LineBlock = styled.View<Required<LineProps>>`
  width: 100%;
  height: 1px;
  padding: 0 ${(props) => props.padding}px;

  ${(props) => props.marginTop > 0
    && css`
      margin-top: ${props.marginTop}px;
    `}
  ${(props) => props.marginBottom > 0
    && css`
      margin-bottom: ${props.marginBottom}px;
    `}
`;

const Hr = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.colors.border};
`;

export default Line;
