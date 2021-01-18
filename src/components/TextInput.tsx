import styled from 'styled-components/native';

const TextInput = styled.TextInput`
  height: 56px;
  background-color: ${(props) => props.theme.colors.inputBackground};
  color: ${(props) => props.theme.colors.typography.primary};
  border-radius: 16px;
  padding: 0 16px;
  font-size: 18px;
`;

export default TextInput;
