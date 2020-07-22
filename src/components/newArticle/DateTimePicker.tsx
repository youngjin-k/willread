import React, { useState } from 'react';
import styled, { css } from 'styled-components/native';
import dayjs from 'dayjs';
import { TouchableWithoutFeedback } from 'react-native';
import Button from './Button';

const dateItems = Array(30).fill(0).map((_, i) => {
  const date = dayjs().add(i, 'day');
  return {
    label: date.format('YYYY-MM-DD'),
    value: [date.get('year'), date.get('month'), date.get('date')],
  };
});

const ampmItems = [{
  label: '오전',
  value: 'AM',
}, {
  label: '오후',
  value: 'PM',
}];
const hourItems = Array(12).fill(0).map((_, i) => String(i + 1).padStart(2, '0'));
const minuteItems = Array(12).fill(0).map((_, i) => String(i * 5).padStart(2, '0'));

export interface DateTimePickerProps {
  initialDate?: dayjs.Dayjs,
  setManualTime: (date: dayjs.Dayjs) => void;
}

function DateTimePicker({
  initialDate,
  setManualTime,
}: DateTimePickerProps): JSX.Element {
  const [time, setTime] = useState(initialDate || dayjs().add(3, 'hour').set('minute', 0));

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

  const handlePress = () => {
    setManualTime(time);
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
            <List showsVerticalScrollIndicator={false}>
              {dateItems.map(({ label, value }) => (
                <TouchableWithoutFeedback key={label} onPress={() => setDate(value)}>
                  <Item>
                    <ItemLabel active={date === label}>{label}</ItemLabel>
                  </Item>
                </TouchableWithoutFeedback>
              ))}
            </List>
          </DatesScrollWrapper>

          <AMPMScrollWrapper>
            <List showsVerticalScrollIndicator={false}>
              {ampmItems.map(({ label, value }) => (
                <TouchableWithoutFeedback key={value} onPress={() => setAMPM(value)}>
                  <Item>
                    <ItemLabel active={ampm === value}>{label}</ItemLabel>
                  </Item>
                </TouchableWithoutFeedback>
              ))}
            </List>
          </AMPMScrollWrapper>

          <HoursScrollWrapper>
            <List showsVerticalScrollIndicator={false}>
              {hourItems.map((item) => (
                <TouchableWithoutFeedback key={item} onPress={() => setHour(item)}>
                  <Item>
                    <ItemLabel active={hour === item}>{item}</ItemLabel>
                  </Item>
                </TouchableWithoutFeedback>
              ))}
            </List>
          </HoursScrollWrapper>

          <MinutesScrollWrapper>
            <List showsVerticalScrollIndicator={false}>
              {minuteItems.map((item) => (
                <TouchableWithoutFeedback key={item} onPress={() => setMinute(item)}>
                  <Item>
                    <ItemLabel active={minute === item}>{item}</ItemLabel>
                  </Item>
                </TouchableWithoutFeedback>
              ))}
            </List>
          </MinutesScrollWrapper>

        </PickerContainer>
        <Button onPress={handlePress}>완료</Button>
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
  height: ${48 * 3}px;
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
  height: 48px;
  align-items: center;
  justify-content: center;
`;

const ItemLabel = styled.Text<{active: boolean}>`
  font-size: 20px;

  ${(props) => (props.active
    ? css`
    color: ${props.theme.colors.typography.title};
  `
    : css`
    color: ${props.theme.colors.grey1};
  `)}
`;

export default DateTimePicker;
