import React from 'react';
import styled from '@emotion/native';

export interface MenuListProps {
  title?: string;
  children: React.ReactNode;
}

function MenuList({
  title,
  children,
}: MenuListProps) {
  return (
    <MenuListBlock>
      {title && <MenuTitle>{title}</MenuTitle>}
      {children}
    </MenuListBlock>
  );
}

const MenuListBlock = styled.View`
  padding: 16px 0 32px 0;
`;

const MenuTitle = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.colors.typography.secondary};
  margin: 0 24px 4px 24px;
  font-weight: bold;
`;

export default MenuList;
