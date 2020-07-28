/* eslint-disable no-unused-expressions */
import React, { useState, createRef, RefObject } from 'react';
import styled, { css } from 'styled-components/native';
import dayjs from 'dayjs';
import {
  TouchableWithoutFeedback, NativeSyntheticEvent, NativeScrollEvent, ScrollView, Vibration,
} from 'react-native';
import Button from './Button';

const ITEM_HEIGHT = 48;

const items = {
  date: Array(30).fill(0).map((_, i) => {
    const date = dayjs().add(i, 'day');
    return {
      label: date.format('YYYY-MM-DD'),
      value: [date.get('year'), date.get('month'), date.get('date')],
    };
  }),
  ampm: [{
    label: '오전',
    value: 'AM',
  }, {
    label: '오후',
    value: 'PM',
  }],
  hour: Array(12).fill(0).map((_, i) => ({
    label: String(i + 1).padStart(2, '0'),
    value: String(i + 1).padStart(2, '0'),
  })),
  minute: Array(12).fill(0).map((_, i) => ({
    label: String(i * 5).padStart(2, '0'),
    value: String(i * 5).padStart(2, '0'),
  })),
};

export interface DateTimePickerProps {
  initialDate?: dayjs.Dayjs,
  setManualTime: (date: dayjs.Dayjs) => void;
}

function DateTimePicker({
  initialDate,
  setManualTime,
}: DateTimePickerProps): JSX.Element {
  const [time, setTime] = useState(initialDate || dayjs().add(3, 'hour').set('minute', 0));
  const dateScrollViewRef = createRef<ScrollView>();
  const ampmScrollViewRef = createRef<ScrollView>();
  const hourScrollViewRef = createRef<ScrollView>();
  const minuteScrollViewRef = createRef<ScrollView>();

  const date = time.format('YYYY-MM-DD');
  const ampm = time.format('A');
  const hour = time.format('hh');
  const minute = time.format('mm');
  const displayTime = time.format(`M월 D일 ${ampm === 'AM' ? '오전' : '오후'} h:mm`);

  const setDate = (value: number[]) => {
    setTime(
      time
        .set('year', value[0])
        .set('month', value[1])
        .set('date', value[2]),
    );
  };

  const setAMPM = (value: string) => {
    if (ampm === value) {
      return;
    }
    if (ampm === 'AM') {
      setTime(time.add(12, 'hour'));
    } else {
      setTime(time.subtract(12, 'hour'));
    }
  };

  const setHour = (value: string) => {
    setTime(time.set('hour', ampm === 'AM' ? Number(value) : Number(value) + 12));
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
    if (targetType === 'date') {
      fixScrollPosition(
        dateScrollViewRef,
        getScrollTargetIndex(event.nativeEvent.contentOffset.y),
      );
      setDate(items.date[getScrollTargetIndex(event.nativeEvent.contentOffset.y)].value);
    } else if (targetType === 'ampm') {
      fixScrollPosition(
        ampmScrollViewRef,
        getScrollTargetIndex(event.nativeEvent.contentOffset.y),
      );
      setAMPM(items.ampm[getScrollTargetIndex(event.nativeEvent.contentOffset.y)].value);
    } else if (targetType === 'hour') {
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

  const handlePressItem = (target: React.RefObject<ScrollView>, index: number) => {
    fixScrollPosition(target, index * ITEM_HEIGHT);
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
        <PickerContainer>

          <DatesScrollWrapper>
            <Overlay pointerEvents="none" />
            <List
              showsVerticalScrollIndicator={false}
              onMomentumScrollEnd={(event) => handleScrollEnd(event, 'date')}
              ref={dateScrollViewRef}
            >
              <ListSpacing />
              {items.date.map(({ label }, index) => (
                <TouchableWithoutFeedback
                  key={label}
                  onPress={() => handlePressItem(dateScrollViewRef, index)}
                >
                  <Item>
                    <ItemLabel>{label}</ItemLabel>
                  </Item>
                </TouchableWithoutFeedback>
              ))}
              <ListSpacing />
            </List>
            <Overlay pointerEvents="none" bottom />
          </DatesScrollWrapper>

          <AMPMScrollWrapper>
            <Overlay pointerEvents="none" />
            <List
              showsVerticalScrollIndicator={false}
              onMomentumScrollEnd={(event) => handleScrollEnd(event, 'ampm')}
              ref={ampmScrollViewRef}
            >
              <ListSpacing />
              {items.ampm.map(({ label, value }, index) => (
                <TouchableWithoutFeedback
                  key={value}
                  onPress={() => handlePressItem(ampmScrollViewRef, index)}
                >
                  <Item>
                    <ItemLabel>{label}</ItemLabel>
                  </Item>
                </TouchableWithoutFeedback>
              ))}
              <ListSpacing />
            </List>
            <Overlay pointerEvents="none" bottom />
          </AMPMScrollWrapper>

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
                  onPress={() => handlePressItem(hourScrollViewRef, index)}
                >
                  <Item>
                    <ItemLabel>{label}</ItemLabel>
                  </Item>
                </TouchableWithoutFeedback>
              ))}
              <ListSpacing />
            </List>
            <Overlay pointerEvents="none" bottom />
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
                  key={index}
                  onPress={() => handlePressItem(minuteScrollViewRef, index)}
                >
                  <Item>
                    <ItemLabel>{label}</ItemLabel>
                  </Item>
                </TouchableWithoutFeedback>
              ))}
              <ListSpacing />
            </List>
            <Overlay pointerEvents="none" bottom />
          </MinutesScrollWrapper>

        </PickerContainer>
        <Button onPress={handlePressSubmit}>완료</Button>
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
  padding: 16px;
`;

const PickerContainer = styled.View`
  flex-direction: row;
  height: ${ITEM_HEIGHT * 5}px;
  margin-bottom: 16px;
`;

const DatesScrollWrapper = styled.View`
  flex: 46;
`;

const AMPMScrollWrapper = styled.View`
  flex: 18;
`;

const HoursScrollWrapper = styled.View`
  flex: 18;
`;

const MinutesScrollWrapper = styled.View`
  flex: 18;
`;

const List = styled.ScrollView`
  flex: 1;
`;

const Item = styled.View`
  height: ${ITEM_HEIGHT}px;
  align-items: center;
  justify-content: center;
`;

const ItemLabel = styled.Text`
  font-size: 20px;
  color: ${(props) => props.theme.colors.typography.title};
`;

const ListSpacing = styled.View`
  height: ${ITEM_HEIGHT * 2}px;
`;

const Overlay = styled.View<{bottom?: boolean;}>`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 1;

  ${(props) => (props.bottom
    ? css`
      bottom: 0;
      height: ${ITEM_HEIGHT * 2}px;

      background-color: ${props.theme.colors.background};
      opacity: 0.8;
    `
    : css`
      top: 0;
      /* margin-top: ${ITEM_HEIGHT * 2 - 1}px; */
      height: ${ITEM_HEIGHT * 2}px;

      background-color: ${props.theme.colors.background};
      opacity: 0.8;
      /* border-color: ${props.theme.colors.grey2}; */
      /* border-bottom-width: 1px; */
    `)}
`;

export default DateTimePicker;
