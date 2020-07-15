import React, { ReactElement, useState, useEffect } from 'react';
import styled, { css } from 'styled-components/native';
import { TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';
import dayjs from 'dayjs';
import Actions from './Actions';
import Button from './Button';
import { ArticleDraft } from '../../features/articles';
import DateTimePicker from './DateTimePicker';

export interface Step4Props {
  article: ArticleDraft;
  setArticle: (article: ArticleDraft) => void;
  nextStep: () => void;
}

const timeList = [{
  label: '괜찮아요',
  value: 0,
}, {
  label: '1시간 후',
  value: 1,
}, {
  label: '2시간 후',
  value: 2,
}, {
  label: '3시간 후',
  value: 3,
}, {
  label: '내일 이 시간',
  value: 24,
}];

const now = dayjs();

const formatTimeFromNow = (from: dayjs.Dayjs, to: dayjs.Dayjs): NotificationTime => {
  const diffDay = Math.abs(from.diff(to, 'day'));

  const fromNow = [];
  if (diffDay === 0) {
    fromNow.push(`${Math.abs(from.diff(to, 'h'))}시간 후에`);
  } else {
    if (diffDay === 1) {
      fromNow.push('내일');
    } else if (diffDay === 2) {
      fromNow.push('이틀 후');
    } else {
      fromNow.push(`${diffDay}일 후`);
    }

    fromNow.push(to.format('a') === 'am' ? '오전' : '오후');
    fromNow.push(`${to.format('h')}시`);
    fromNow.push(`${to.format('m')}분에`);
  }

  fromNow.push('알려드릴게요');

  return {
    date: to,
    fromNow: fromNow.join(' '),
    dateStr: to.format(`M월 d일 ${to.format('a') === 'am' ? '오전' : '오후'} h:mm`),
  };
};

interface NotificationTime {
  date?: dayjs.Dayjs,
  fromNow: string,
  dateStr: string,
}

function Step4({
  article,
  setArticle,
  nextStep,
}: Step4Props): ReactElement {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTimeIndex, setActiveTimeIndex] = useState<number | string>(2);
  const [notificationTime, setNotificationTime] = useState<NotificationTime>({
    fromNow: '',
    dateStr: '',
  });

  const handlePressTime = (hour: number, index: number) => {
    setActiveTimeIndex(index);
    const date = dayjs(now).add(hour, 'h');
    setNotificationTime(formatTimeFromNow(now, date));
  };

  const handlePressManualTime = () => {
    // setActiveTimeIndex()
    setModalVisible(true);
  };

  useEffect(() => {
    handlePressTime(2, 2);
  }, []);

  return (
    <>
      <Container>
        <Header>
          {activeTimeIndex !== 0 ? (
            <>
              <TimeFromNow>
                {notificationTime.fromNow}
              </TimeFromNow>
              <Time>{notificationTime.dateStr}</Time>
            </>
          ) : (
            <TimeFromNow>
              읽고싶은 시간을 설정하세요
            </TimeFromNow>
          )}
        </Header>

        <TimeList>
          {timeList.map((time, index) => (
            <TouchableWithoutFeedback key={index} onPress={() => handlePressTime(time.value, index)}>
              <TimeItem active={index === activeTimeIndex}>
                <TimeItemLabel active={index === activeTimeIndex}>{time.label}</TimeItemLabel>
              </TimeItem>
            </TouchableWithoutFeedback>
          ))}
          <TouchableWithoutFeedback onPress={() => handlePressManualTime()}>
            <TimeItem active={activeTimeIndex === timeList.length}>
              <TimeItemLabel active={activeTimeIndex === timeList.length}>직접 선택할게요</TimeItemLabel>
            </TimeItem>
          </TouchableWithoutFeedback>
        </TimeList>
      </Container>

      <Actions>
        <Button onPress={nextStep}>완료</Button>
      </Actions>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down"
        propagateSwipe
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <DateTimePicker />
      </Modal>
    </>
  );
}

const Container = styled.View`
  padding: 0 16px;
`;

const Header = styled.View`
  height: 120px;
  justify-content: center;
  align-items: center;
`;

const TimeFromNow = styled.Text`
  font-size: 22px;
  color: ${(props) => props.theme.colors.typography.title};
  margin: 0 0 8px 0;
`;

const Time = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.colors.typography.secondary};
`;

const TimeList = styled.ScrollView`
  padding: 16px 0;
`;

const TimeItem = styled.View<{active: boolean}>`
  height: 48px;
  padding: 0 16px;
  border-radius: 8px;
  margin: 8px 0;
  align-items: center;
  justify-content: center;

  ${(props) => props.active && css`
    background-color: ${props.theme.colors.primaryTender};
  `}
`;

const TimeItemLabel = styled.Text<{active: boolean}>`
  color: ${(props) => props.theme.colors.typography.secondary};
  font-size: 20px;

  ${(props) => props.active && css`
    color: ${props.theme.colors.primary};
  `}
`;

export default Step4;
