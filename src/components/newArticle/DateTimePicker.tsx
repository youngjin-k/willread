import React, { ReactElement, useState, useEffect } from 'react';
import styled, { css } from 'styled-components/native';
import dayjs from 'dayjs';
import { TouchableWithoutFeedback } from 'react-native';
import Button from './Button';

const dateItems = Array(30).fill(0).map((_, i) => dayjs().add(i, 'day').format('YYYY-MM-DD'));
const ampmItems = ['오전', '오후'];
const hourItems = Array(12).fill(0).map((_, i) => String(i + 1).padStart(2, '0'));
const minuteItems = Array(12).fill(0).map((_, i) => String(i * 5).padStart(2, '0'));

function DateTimePicker(): JSX.Element {
  const [date, setDate] = useState(dateItems[0]);
  const [ampm, setAMPM] = useState(ampmItems[0]);
  const [hour, setHour] = useState(hourItems[0]);
  const [minute, setMinute] = useState(minuteItems[0]);
  return (
    <DateTimePickerBlock>
      <HandleWrapper>
        <Handle />
      </HandleWrapper>
      <Content>
        <PickerContainer>

          <DatesScrollWrapper>
            <List showsVerticalScrollIndicator={false}>
              {dateItems.map((item) => (
                <TouchableWithoutFeedback key={item} onPress={() => setDate(item)}>
                  <Item>
                    <ItemLabel active={date === item}>{item}</ItemLabel>
                  </Item>
                </TouchableWithoutFeedback>
              ))}
            </List>
          </DatesScrollWrapper>

          <AMPMScrollWrapper>
            <List showsVerticalScrollIndicator={false}>
              {ampmItems.map((item) => (
                <TouchableWithoutFeedback key={item} onPress={() => setAMPM(item)}>
                  <Item>
                    <ItemLabel active={ampm === item}>{item}</ItemLabel>
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
        <Button>완료</Button>
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
  padding: 8px;
  align-items: center;
  justify-content: center;
`;

const Handle = styled.View`
    width: 60px;
    height: 6px;
    border-radius: 3px;
    background-color: ${(props) => props.theme.colors.grey1};
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
  /* color: ${(props) => props.theme.colors.typography[props.active ? 'title' : 'secondary']}; */

  ${(props) => (props.active
    ? css`
    color: ${props.theme.colors.typography.title};
  `
    : css`
    color: ${props.theme.colors.typography.secondary};
  `)}
`;

export default DateTimePicker;
