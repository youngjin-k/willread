import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Pressable, ScaledSize } from 'react-native';
import styled from 'styled-components/native';

import { CategoryColors } from '../features/homeCategoryFilters';

export interface CategoryPickerProps {
  value: CategoryColors;
  onChange: (color: CategoryColors) => void;
  containerSize?: number;
}

function CategoryPicker({
  value,
  onChange,
  containerSize = Dimensions.get('window').width,
}: CategoryPickerProps): React.ReactElement {
  const [windowWidth, setWindowWidth] = useState(containerSize);

  const onChangeDimensions = ({
    window,
  }: {
    window: ScaledSize;
    screen: ScaledSize;
  }) => {
    setWindowWidth(window.width);
  };

  useEffect(() => {
    Dimensions.addEventListener('change', onChangeDimensions);
    return () => {
      Dimensions.removeEventListener('change', onChangeDimensions);
    };
  });

  const handlePress = (color: CategoryColors) => {
    if (onChange) {
      onChange(color);
    }
  };

  const buttonSize = useMemo(() => {
    if (windowWidth > 560) {
      return (560 - 32) / 3 - 16;
    }
    return (windowWidth - 32) / 3 - 16;
  }, [windowWidth]);

  return (
    <CategoryPickerBlock>
      {Object.values(CategoryColors).map((color) => (color === CategoryColors.DEFAULT ? null : (
        <CategoryItemWrapper
          key={color}
          buttonSize={buttonSize}
        >
          <Pressable onPress={() => handlePress(color)}>
            <CategoryColorBar
              color={color}
              buttonSize={buttonSize}
            >
              {color === value && <ActiveRing buttonSize={buttonSize} />}
            </CategoryColorBar>
          </Pressable>
        </CategoryItemWrapper>
      )))}
    </CategoryPickerBlock>
  );
}

const CategoryPickerBlock = styled.View`
  flex: 1;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 8px;
  margin: 0 auto;
  max-width: 560px;
`;

const CategoryItemWrapper = styled.View<{ buttonSize: number }>`
  padding: 8px;
  width: ${(props) => props.buttonSize + 16}px;
  height: ${(props) => props.buttonSize + 16}px;
`;

const CategoryColorBar = styled.View<{
  color: CategoryColors;
  buttonSize: number;
}>`
  justify-content: center;
  align-items: center;
  border-radius: ${(props) => props.buttonSize / 2}px;
  width: ${(props) => props.buttonSize}px;
  height: ${(props) => props.buttonSize}px;
  background-color: ${(props) => props.theme.colors.category[props.color]};
  padding: 12px;
`;

const ActiveRing = styled.View<{ buttonSize: number }>`
  width: 100%;
  height: 100%;
  border: 3px solid #ffffff;
  border-radius: ${(props) => (props.buttonSize - 24) / 2}px;
`;
export default CategoryPicker;
