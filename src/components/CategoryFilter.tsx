import React, { ReactElement, useState } from 'react';
import {
  TouchableOpacity,
} from 'react-native';
import styled, { css } from 'styled-components/native';
import { useColorScheme, ColorSchemeName } from 'react-native-appearance';
import { Feather } from '@expo/vector-icons';

export enum CategoryColors {
    default = 'default',
    red = 'red',
    blue = 'blue',
    orange = 'orange',
    green = 'green',
    yellow = 'yellow',
    purple = 'purple',
}

function CategoryFilter(): ReactElement {
  const [selected, setSelected] = useState<CategoryColors>(CategoryColors.default);

  return (
    <Container
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {Object.values(CategoryColors).map((color) => (
        <CategoryItemWrapper
          key={color}
          onPress={() => setSelected(color)}
        >
          <CategoryItem
            color={color}
            active={color === selected}
          >
            {color === 'default' && <CategoryItemLabel>All</CategoryItemLabel>}
          </CategoryItem>
        </CategoryItemWrapper>
      ))}
    </Container>
  );
}

const Container = styled.ScrollView`
    flex-direction: row;
    padding: 16px 8px;
`;

const CategoryItemWrapper = styled(TouchableOpacity)`
    min-width: 48px;
    height: 48px;
    padding: 8px;
    align-items: center;
    justify-content: center;
`;

const CategoryItem = styled.View<{color: CategoryColors, active: boolean}>`
    min-width: 32px;
    height: 32px;
    border-radius: 16px;
    padding: 0 16px;
    align-items: center;
    flex-direction: row;
    opacity: 0.25;

    background-color: ${(props) => props.theme.colors.category[props.color]};

    ${(props) => props.active && css`opacity: 1;`}
`;

const CategoryItemLabel = styled.Text`
    font-size: 12px;
    color: rgba(0, 0, 0, .56);
`;

const WillreadItemBlock = styled.View`
    padding: 0 16px 16px 16px;
    flex-direction: row;
`;

const ThumbnailWrapper = styled.View`
    border-radius: 16px;
    background-color: ${(props) => props.theme.colors.secondary};
`;

const Thumbnail = styled.Image<{scheme: ColorSchemeName}>`
    width: 96px;
    height: 96px;
    border-radius: 16px;

    ${(props) => props.scheme === 'dark' && css`
        opacity: 0.8;
    `}
`;

const Content = styled.View`
    flex: 1;
    padding-left: 8px;
`;

const Title = styled.Text`
    font-size: 16px;
    color: ${(props) => props.theme.colors.typography.title};
    margin: 0 0 0 8px;
`;

const SubTitle = styled.Text`
    font-size: 12px;
    color: ${(props) => props.theme.colors.typography.secondary};
    margin: 4px 0 0 8px;
`;

export default CategoryFilter;
