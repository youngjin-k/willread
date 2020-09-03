/* eslint-disable no-unused-expressions */
import React, {
  useState, createRef, RefObject, useEffect,
} from 'react';
import styled, { css } from 'styled-components/native';
import dayjs, { Dayjs } from 'dayjs';
import {
  TouchableWithoutFeedback, NativeSyntheticEvent, NativeScrollEvent, ScrollView,
} from 'react-native';
import { DefaultTheme } from 'styled-components';
import Button from './Button';
import Line from '../Line';

const ITEM_HEIGHT = 48;

const dayOfWeekKo = (day: number): string => {
  switch (day) {
    case 0: return '일';
    case 1: return '월';
    case 2: return '화';
    case 3: return '수';
    case 4: return '목';
    case 5: return '금';
    case 6: return '토';
    default: return '';
  }
};

type DateValue = {
  year: number;
  month: number;
  date: number;
  ymd: string;
  dayOfWeek: number;
  dayOfWeekName: string;
}

const items = {
  date: Array(14).fill(0).map((_, i) => {
    const date = dayjs().add(3, 'hour').add(i, 'day');
    return {
      label: date.format('DD'),
      value: {
        year: date.get('year'),
        month: date.get('month'),
        date: date.get('date'),
        ymd: date.format('YYYY-MM-DD'),
        dayOfWeek: date.get('day'),
        dayOfWeekName: dayOfWeekKo(date.get('day')),
      },
    };
  }),
  hour: Array(23).fill(0).map((_, i) => ({
    label: `${String(i + 1).padStart(2, '0')}시`,
    value: String(i + 1).padStart(2, '0'),
  })),
  minute: Array(12).fill(0).map((_, i) => ({
    label: `${String(i * 5).padStart(2, '0')}분`,
    value: String(i * 5).padStart(2, '0'),
  })),
};

export interface DateTimePickerProps {
  initialDate?: Dayjs,
  setManualTime: (date: Dayjs) => void;
}

function DateTimePicker({
  initialDate,
  setManualTime,
}: DateTimePickerProps): JSX.Element {
  const [time, setTime] = useState(initialDate || dayjs().add(3, 'hour').set('minute', 0));
  const hourScrollViewRef = createRef<ScrollView>();
  const minuteScrollViewRef = createRef<ScrollView>();

  const date = time.format('YYYY-MM-DD');
  const hour = time.format('HH');
  const minute = time.format('mm');
  const displayTime = time.format(
    `M월 D일 ${time.format('a') === 'am' ? '오전' : '오후'} h:mm`,
  );

  const setDate = (values: DateValue) => {
    setTime(
      time
        .set('year', values.year)
        .set('month', values.month)
        .set('date', values.date),
    );
  };

  const setHour = (value: string) => {
    setTime(time.set('hour', Number(value)));
  };

  const setMinute = (value: string) => {
    setTime(time.set('minute', Number(value)));
  };

  const handlePressSubmit = () => {
    setManualTime(time);
  };

  const getScrollTargetIndex = (scrollY: number): number => {
    const y = (scrollY % ITEM_HEIGHT) > (ITEM_HEIGHT / 2)
      ? ITEM_HEIGHT - (scrollY % ITEM_HEIGHT)
      : -1 * (scrollY % ITEM_HEIGHT);
    return (scrollY + y) / ITEM_HEIGHT;
  };

  const fixScrollPosition = (target: React.RefObject<ScrollView>, targetIndex: number) => {
    target.current?.scrollTo({
      y: targetIndex * ITEM_HEIGHT,
      animated: true,
    });
  };

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>, targetType: string) => {
    if (targetType === 'hour') {
      fixScrollPosition(
        hourScrollViewRef,
        getScrollTargetIndex(event.nativeEvent.contentOffset.y),
      );
      setHour(items.hour[getScrollTargetIndex(event.nativeEvent.contentOffset.y)].value);
    } else if (targetType === 'minute') {
      fixScrollPosition(
        minuteScrollViewRef,
        getScrollTargetIndex(event.nativeEvent.contentOffset.y),
      );
      setMinute(items.minute[getScrollTargetIndex(event.nativeEvent.contentOffset.y)].value);
    }
  };

  const handlePressDateTimeItem = (target: React.RefObject<ScrollView>, index: number) => {
    fixScrollPosition(target, index);
  };

  return (
    <DateTimePickerBlock>
      <HandleWrapper>
        <Handle />
      </HandleWrapper>
      <Content>
        <TimeView>
          <Time>{displayTime}</Time>
        </TimeView>

        <DatePickerContainer>
          <DatesScrollWrapper
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 8 }}
          >
            {items.date.map(({ label, value }, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => setDate(value)}
              >
                <DateItem>
                  <DayOfWeekLabel day={value.dayOfWeek}>{value.dayOfWeekName}</DayOfWeekLabel>
                  <DateLabelWrapper active={value.ymd === date}>
                    <DateLabel active={value.ymd === date}>{label}</DateLabel>
                  </DateLabelWrapper>
                </DateItem>
              </TouchableWithoutFeedback>
            ))}
          </DatesScrollWrapper>
        </DatePickerContainer>

        <Line />

        <TimePickerContainer>
          <HoursScrollWrapper>
            <Overlay pointerEvents="none" />
            <List
              showsVerticalScrollIndicator={false}
              onMomentumScrollEnd={(event) => handleScrollEnd(event, 'hour')}
              ref={hourScrollViewRef}
            >
              <ListSpacing />
              {items.hour.map(({ label, value }, index) => (
                <TouchableWithoutFeedback
                  key={value}
                  onPress={() => handlePressDateTimeItem(hourScrollViewRef, index)}
                >
                  <Item>
                    <ItemLabel active={value === hour}>{label}</ItemLabel>
                  </Item>
                </TouchableWithoutFeedback>
              ))}
              <ListSpacing />
            </List>
          </HoursScrollWrapper>

          <MinutesScrollWrapper>
            <Overlay pointerEvents="none" />
            <List
              showsVerticalScrollIndicator={false}
              onMomentumScrollEnd={(event) => handleScrollEnd(event, 'minute')}
              ref={minuteScrollViewRef}
            >
              <ListSpacing />
              {items.minute.map(({ label, value }, index) => (
                <TouchableWithoutFeedback
                  key={value}
                  onPress={() => handlePressDateTimeItem(minuteScrollViewRef, index)}
                >
                  <Item>
                    <ItemLabel active={value === minute}>{label}</ItemLabel>
                  </Item>
                </TouchableWithoutFeedback>
              ))}
              <ListSpacing />
            </List>
          </MinutesScrollWrapper>

        </TimePickerContainer>
        <ButtonWrapper>
          <Button onPress={handlePressSubmit}>완료</Button>
        </ButtonWrapper>
      </Content>
    </DateTimePickerBlock>
  );
}

const DateTimePickerBlock = styled.SafeAreaView`
  background-color: ${(props) => props.theme.colors.background};
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const HandleWrapper = styled.View`
  padding: 8px 0 0 0;
  align-items: center;
  justify-content: center;
`;

const Handle = styled.View`
  width: 60px;
  height: 6px;
  border-radius: 3px;
  background-color: ${(props) => props.theme.colors.grey1};
`;

const TimeView = styled.View`
  padding: 32px 0;
  align-items: center;
`;

const Time = styled.Text`
  font-size: 26px;
  color: ${(props) => props.theme.colors.typography.title};
`;

const Content = styled.View`
  padding: 16px 0;
`;

const DatePickerContainer = styled.View`
  margin-bottom: 16px;
`;

const DatesScrollWrapper = styled.ScrollView`
  flex-direction: row;
`;

const DateItem = styled.View`
  padding: 0 8px;
  align-items: center;
`;

const getDayOfWeekLabelColor = (day: number, theme: DefaultTheme) => {
  switch (day) {
    case 6: return theme.colors.primary;
    case 0: return theme.colors.category.red;
    default: return theme.colors.typography.secondary;
  }
};

const DayOfWeekLabel = styled.Text<{day: number}>`
  font-size: 16px;
  margin-bottom: 16px;

  color: ${(props) => getDayOfWeekLabelColor(props.day, props.theme)};
`;

const DateLabelWrapper = styled.View<{active: boolean}>`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  
  ${(props) => props.active && css`
    background-color: ${props.theme.colors.primaryTender};
  `}
`;

const DateLabel = styled.Text<{active: boolean}>`
  font-size: 22px;
  color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.typography.title)};
`;

const TimePickerContainer = styled.View`
  margin-bottom: 16px;
  flex-direction: row;
  height: ${ITEM_HEIGHT * 3}px;
`;

const HoursScrollWrapper = styled.View`
  flex: 1;
`;

const MinutesScrollWrapper = styled.View`
  flex: 1;
`;

const List = styled.ScrollView`
  flex: 1;
`;

const Item = styled.View`
  height: ${ITEM_HEIGHT}px;
  align-items: center;
  justify-content: center;
`;

const ItemLabel = styled.Text<{active: boolean}>`
  font-size: 20px;
  color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.typography.title)};
`;

const ListSpacing = styled.View`
  height: ${ITEM_HEIGHT}px;
`;

const Overlay = styled.View`
  position: absolute;
  left: 32px;
  right: 32px;
  top: ${ITEM_HEIGHT}px;
  height: ${ITEM_HEIGHT}px;
  z-index: 1;
  background-color: ${(props) => props.theme.colors.primaryTender};
  border-radius: 16px;
`;

const ButtonWrapper = styled.View`
  padding: 0 16px;
`;

export default DateTimePicker;
