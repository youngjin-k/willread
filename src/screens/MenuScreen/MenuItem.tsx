import React, { ReactNode } from 'react';
import { GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styled from 'styled-components/native';
import PressableWrapper from '../../components/articleCard/PressableWrapper';

export interface MenuListProps {
  title: string;
  menuIconName?: string;
  value?: string;
  hasSubMenu?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  checked?: boolean;
  right?: ReactNode;
}

function MenuItem({
  title,
  menuIconName,
  value,
  hasSubMenu,
  onPress,
  checked,
  right,
}: MenuListProps) {
  return (
    <PressableWrapper
      onPress={onPress}
      pressable={Boolean(onPress)}
    >
      <MenuItemBlock>
        {menuIconName && <MenuIcon name={menuIconName} />}
        <MenuName>{title}</MenuName>
        {value && <MenuValue>{value}</MenuValue>}
        {hasSubMenu && <SubMenuIcon name="chevron-right" />}
        {checked && <CheckIcon name="check" />}
        {right}
      </MenuItemBlock>
    </PressableWrapper>
  );
}
const MenuItemBlock = styled.View`
  height: 64px;
  flex-direction: row;
  align-items: center;
  padding: 0 24px;
`;

const MenuIcon = styled(Icon)`
  margin: 0 16px 0 0;
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.primary};
`;

const MenuName = styled.Text`
  font-size: 18px;
  color: ${(props) => props.theme.colors.typography.primary};
  flex-grow: 1;
`;

const MenuValue = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.typography.secondary};
`;

const SubMenuIcon = styled(Icon)`
  margin: 0 0 0 16px;
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.secondary};
`;

const CheckIcon = styled(Icon)`
  margin: 0 0 0 16px;
  font-size: 24px;
  color: ${(props) => props.theme.colors.typography.point};
`;

export default MenuItem;
