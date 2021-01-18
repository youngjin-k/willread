import React, { ReactElement } from 'react';
import styled from 'styled-components/native';

export interface FormLabelProps {
    children: ReactElement | string;
}

function FormLabel({ children }: FormLabelProps): ReactElement {
  return (
    <FormLabelBlock>{children}</FormLabelBlock>
  );
}

const FormLabelBlock = styled.Text`
    font-size: 16px;
    color: ${(props) => props.theme.colors.typography.primary};
    margin: 0 0 12px 8px;
    font-weight: bold;
`;

export default FormLabel;
