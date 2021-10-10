import React from 'react';
import { GestureResponderEvent } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import styled from '@emotion/native';
import PressableWrapper from '../../components/articleCard/PressableWrapper';

export interface MenuListProps {
  title: string;
  menuIconName?: string;
  value?: string;
  hasSubMenu?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  checked?: boolean;
}

function MenuItem({
  title,
  menuIconName,
  value,
  hasSubMenu,
  onPress,
  checked,
}: MenuListProps) {
  return (
    <PressableWrapper onPress={onPress}>
      <MenuItemBlock>
        {menuIconName && <MenuIcon name={menuIconName} />}
        <MenuName>{title}</MenuName>
        {value && <MenuValue>{value}</MenuValue>}
        {hasSubMenu && <SubMenuIcon name="chevron-right" />}
        {checked && <CheckIcon name="check" />}
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
