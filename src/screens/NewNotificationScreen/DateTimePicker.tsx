import dayjs, { Dayjs } from 'dayjs';
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { DefaultTheme } from 'styled-components';
import styled, { css } from 'styled-components/native';
import BottomCtaContainer from '../../components/BottomCtaContainer';

import Button, { ButtonSize } from '../../components/Button';
import Line from '../../components/Line';

const ITEM_HEIGHT = 48;

const dayOfWeekKo = (day: number): string => {
  switch (day) {
    case 0:
      return '일';
    case 1:
      return '월';
    case 2:
      return '화';
    case 3:
      return '수';
    case 4:
      return '목';
    case 5:
      return '금';
    case 6:
      return '토';
    default:
      return '';
  }
};

type DateValue = {
  year: number;
  month: number;
  date: number;
  ymd: string;
  dayOfWeek: number;
  dayOfWeekName: string;
};

const items = {
  date: Array(7)
    .fill(0)
    .map((_, i) => {
      const date = dayjs().add(i, 'day');
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
  hour: Array(24)
    .fill(0)
    .map((_, i) => ({
      label: `${String(i).padStart(2, '0')}시`,
      value: String(i).padStart(2, '0'),
    })),
  minute: Array(12)
    .fill(0)
    .map((_, i) => ({
      label: `${String(i * 5).padStart(2, '0')}분`,
      value: String(i * 5).padStart(2, '0'),
    })),
};

const getScrollTargetIndex = (scrollY: number): number => {
  const y = scrollY % ITEM_HEIGHT > ITEM_HEIGHT / 2
    ? ITEM_HEIGHT - (scrollY % ITEM_HEIGHT)
    : -1 * (scrollY % ITEM_HEIGHT);
  return (scrollY + y) / ITEM_HEIGHT;
};

const fixScrollPosition = (
  target: React.RefObject<ScrollView>,
  targetIndex: number,
) => {
  if (target.current) {
    target.current.scrollTo({
      y: targetIndex * ITEM_HEIGHT,
      animated: true,
    });
  }
};

export interface DateTimePickerProps {
  initialDate?: Dayjs;
  setManualTime: (date: Dayjs) => void;
  articleExpiryDate: string;
  visible: boolean;
}

function DateTimePicker({
  initialDate,
  setManualTime,
  articleExpiryDate,
  visible,
}: DateTimePickerProps): JSX.Element {
  const [time, setTime] = useState(
    initialDate || dayjs().add(3, 'hour').set('minute', 0),
  );
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const hourScrollViewRef = useRef<ScrollView>(null);
  const minuteScrollViewRef = useRef<ScrollView>(null);
  const isFixedScroll = useRef(false);

  const date = time.format('YYYY-MM-DD');
  const hour = time.format('HH');
  const minute = time.format('mm');
  const displayTime = time.format(
    `M월 D일 ${time.format('a') === 'am' ? '오전' : '오후'} h:mm`,
  );

  const maxDate = useMemo(() => dayjs(articleExpiryDate), [
    articleExpiryDate,
  ]);

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

  const handleScrollEnd = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
    targetType: string,
  ) => {
    if (targetType === 'hour') {
      const index = Math.max(
        0,
        Math.min(23, getScrollTargetIndex(event.nativeEvent.contentOffset.y)),
      );
      const { value } = items.hour[index];
      setHour(value);
    } else if (targetType === 'minute') {
      const index = Math.max(
        0,
        Math.min(11, getScrollTargetIndex(event.nativeEvent.contentOffset.y)),
      );
      const { value } = items.minute[index];
      setMinute(value);
    }
  };

  useEffect(() => {
    if (visible && !isFixedScroll.current) {
      setTimeout(() => {
        isFixedScroll.current = true;
        fixScrollPosition(hourScrollViewRef, time.get('hour'));
        fixScrollPosition(minuteScrollViewRef, time.get('minute') / 5);
      }, 200);
    }

    if (!visible) {
      isFixedScroll.current = false;
    }
  }, [time, visible]);

  const handleHourItemPress = (value: string) => {
    fixScrollPosition(hourScrollViewRef, Number(value));
    if (Platform.OS === 'android') {
      setHour(value);
    }
  };

  const handleMinuteItemPress = (value: string) => {
    fixScrollPosition(minuteScrollViewRef, Number(value) / 5);
    if (Platform.OS === 'android') {
      setMinute(value);
    }
  };

  useEffect(() => {
    const minErrorMessage = '과거로는 설정할 수 없어요 😅';
    const maxErrorMessage = '설정할 수 없는 시간이에요 😅';

    const isValidMinDate = dayjs().isAfter(time);
    const isValidMaxDate = maxDate.isBefore(time);

    if (isValidMinDate || isValidMaxDate) {
      setIsInvalid(true);
      setErrorMessage(isValidMinDate ? minErrorMessage : maxErrorMessage);
    } else {
      setIsInvalid(false);
      setErrorMessage(null);
    }
  }, [time, maxDate]);

  return (
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
                <DayOfWeekLabel day={value.dayOfWeek}>
                  {value.dayOfWeekName}
                </DayOfWeekLabel>
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
          <Overlay
            pointerEvents="none"
            position="left"
          />
          <List
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              handleScrollEnd(event, 'hour');
            }}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            ref={hourScrollViewRef}
          >
            <ListSpacing />
            {items.hour.map(({ label, value }) => (
              <TouchableWithoutFeedback
                key={value}
                onPress={() => {
                  handleHourItemPress(value);
                }}
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
          <Overlay
            pointerEvents="none"
            position="right"
          />
          <List
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              handleScrollEnd(event, 'minute');
            }}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            bouncesZoom
            ref={minuteScrollViewRef}
          >
            <ListSpacing />
            {items.minute.map(({ label, value }) => (
              <TouchableWithoutFeedback
                key={value}
                onPress={() => {
                  handleMinuteItemPress(value);
                }}
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
      <BottomCtaContainer style={{ paddingTop: 0 }}>
        <Button
          onPress={handlePressSubmit}
          disabled={isInvalid}
          label={isInvalid ? (errorMessage as string) : '완료'}
          size={ButtonSize.Large}
        />
      </BottomCtaContainer>
    </Content>
  );
}

const TimeView = styled.View`
  padding: 24px 0 32px 0;
  align-items: center;
`;

const Time = styled.Text`
  font-size: 26px;
  color: ${(props) => props.theme.colors.typography.primary};
`;

const Content = styled.View``;

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
    case 6:
      return theme.colors.typography.point;
    case 0:
      return theme.colors.danger;
    default:
      return theme.colors.typography.secondary;
  }
};

const DayOfWeekLabel = styled.Text<{ day: number }>`
  font-size: 16px;
  margin-bottom: 16px;

  color: ${(props) => getDayOfWeekLabelColor(props.day, props.theme)};
`;

const DateLabelWrapper = styled.View<{ active: boolean }>`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: transparent;

  ${(props) => props.active
    && css`
      background-color: ${props.theme.colors.primaryTender};
    `}
`;

const DateLabel = styled.Text<{ active: boolean }>`
  font-size: 22px;
  color: ${(props) => (props.active
    ? props.theme.colors.typography.point
    : props.theme.colors.typography.primary)};
`;

const TimePickerContainer = styled.View`
  flex-direction: row;
  height: ${ITEM_HEIGHT * 5}px;
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

const ItemLabel = styled.Text<{ active: boolean }>`
  font-size: 20px;
  color: ${(props) => (props.active
    ? props.theme.colors.typography.point
    : props.theme.colors.typography.primary)};
`;

const ListSpacing = () => (
  <TouchableWithoutFeedback>
    <View style={{ height: ITEM_HEIGHT * 2 }} />
  </TouchableWithoutFeedback>
);

const Overlay = styled.View<{ position: 'left' | 'right' }>`
  position: absolute;
  top: ${ITEM_HEIGHT * 2}px;
  height: ${ITEM_HEIGHT}px;
  z-index: 1;
  background-color: ${(props) => props.theme.colors.primaryTender};

  ${(props) => props.position === 'left'
    && css`
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
      left: 16px;
      right: 0;
    `}

  ${(props) => props.position === 'right'
    && css`
      border-top-right-radius: 16px;
      border-bottom-right-radius: 16px;
      left: 0;
      right: 16px;
    `}
`;

export default DateTimePicker;
