import React, {
  ReactElement, useState, useEffect, useCallback,
} from 'react';
import styled, { css } from 'styled-components/native';
import { TouchableWithoutFeedback } from 'react-native';
import Modal from 'react-native-modal';
import dayjs from 'dayjs';
import * as Notifications from 'expo-notifications';
import { useDispatch } from 'react-redux';
import Actions from './Actions';
import Button, { ButtonSize } from '../Button';
import { addArticle, updateArticle } from '../../features/article/articles';
import DateTimePicker from './DateTimePicker';
import useArticle from '../../features/article/useArticle';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export interface Step4Props {
  nextStep: () => void;
}

const timeList = [
  {
    label: '괜찮아요',
    value: 0,
  },
  {
    label: '1시간 후',
    value: 1,
  },
  {
    label: '2시간 후',
    value: 2,
  },
  {
    label: '3시간 후',
    value: 3,
  },
  {
    label: '내일 이 시간',
    value: 24,
  },
];

const now = dayjs();

const formatTimeFromNow = (
  from: dayjs.Dayjs,
  to: dayjs.Dayjs,
): NotificationTime => {
  const diffDay = Math.abs(from.diff(to, 'day'));

  const fromNow = [];
  if (diffDay === 0) {
    if (Math.abs(from.diff(to, 'hour')) > 0) {
      fromNow.push(`${Math.abs(from.diff(to, 'hour'))}시간`);
    }
    if (Math.abs(from.diff(to, 'minute')) % 60 > 0) {
      fromNow.push(`${Math.abs(from.diff(to, 'minute') % 60)}분`);
    }
    fromNow.push('후');
  } else {
    if (diffDay === 1) {
      fromNow.push('내일');
    } else if (diffDay === 2) {
      fromNow.push('이틀 후');
    } else {
      fromNow.push(`${diffDay}일 후`);
    }

    fromNow.push(to.format('a') === 'am' ? '오전' : '오후');

    if (to.get('minute') > 0) {
      fromNow.push(`${to.format('h')}시`);
      fromNow.push(`${to.format('m')}분에`);
    } else {
      fromNow.push(`${to.format('h')}시에`);
    }
  }

  fromNow.push('알려드릴게요');

  return {
    date: to,
    fromNow: fromNow.join(' '),
    dateStr: to.format(
      `M월 D일 ${to.format('a') === 'am' ? '오전' : '오후'} h:mm`,
    ),
  };
};

const initialNotificationTime = {
  fromNow: '',
  dateStr: '',
};

interface NotificationTime {
  date?: dayjs.Dayjs;
  fromNow: string;
  dateStr: string;
}

function Step4({ nextStep }: Step4Props): ReactElement {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTimeIndex, setActiveTimeIndex] = useState<number | string>(2);
  const [notificationDate, setNotificationDate] = useState<NotificationTime>(
    initialNotificationTime,
  );
  const dispatch = useDispatch();
  const { articleDraft, setArticleDraft, lastAddedArticle } = useArticle();

  const handlePressTime = (hour: number, index: number) => {
    setActiveTimeIndex(index);

    if (hour === 0) {
      setNotificationDate(initialNotificationTime);
      return;
    }

    const date = dayjs(now).add(hour, 'h');
    setNotificationDate(formatTimeFromNow(now, date));
  };

  useEffect(() => {
    handlePressTime(2, 2);
  }, []);

  const handlePressManualTime = () => {
    setModalVisible(true);
  };

  const setManualTime = (date: dayjs.Dayjs) => {
    setModalVisible(false);
    setActiveTimeIndex(timeList.length);
    setNotificationDate(formatTimeFromNow(now, date));
  };

  const save = useCallback(() => {
    dispatch(addArticle(articleDraft));
  }, [dispatch, articleDraft]);

  const setNotification = async () => {
    if (!notificationDate.date) {
      return null;
    }
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '윌리드할 시간이에요!',
        body: articleDraft.title,
        sound: 'default',
        data: {
          articleDraft,
        },
      },
      trigger: notificationDate.date.toDate(),
    });
    return id;
  };

  const allowsNotificationsAsync = async () => {
    const settings = await Notifications.getPermissionsAsync();
    return settings.granted;
  };

  const requestPermissionsAsync = async () => Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowAnnouncements: true,
    },
  });

  const handlePressComplete = async () => {
    setLoading(true);
    save();

    if (notificationDate.date) {
      const allowsPermissions = await allowsNotificationsAsync();
      if (!allowsPermissions) {
        await requestPermissionsAsync();
      }

      const notificationId = await setNotification();

      if (lastAddedArticle) {
        dispatch(
          updateArticle({
            id: lastAddedArticle.id,
            article: {
              ...lastAddedArticle,
              scheduleNotification: {
                id: notificationId,
                date: notificationDate.date.toDate(),
              },
            },
          }),
        );
      }
    }

    setLoading(false);
    nextStep();
  };

  return (
    <>
      <Container>
        <Header>
          {activeTimeIndex !== 0 ? (
            <>
              <TimeFromNow>{notificationDate.fromNow}</TimeFromNow>
              <Time>{notificationDate.dateStr}</Time>
            </>
          ) : (
            <TimeFromNow>읽고싶은 시간을 설정하세요</TimeFromNow>
          )}
        </Header>

        <TimeList
          contentContainerStyle={{
            paddingVertical: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          {timeList.map((time, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPress={() => handlePressTime(time.value, index)}
            >
              <TimeItem active={index === activeTimeIndex}>
                <TimeItemLabel active={index === activeTimeIndex}>
                  {time.label}
                </TimeItemLabel>
              </TimeItem>
            </TouchableWithoutFeedback>
          ))}
          <TouchableWithoutFeedback onPress={() => handlePressManualTime()}>
            <TimeItem active={activeTimeIndex === timeList.length}>
              <TimeItemLabel active={activeTimeIndex === timeList.length}>
                직접 선택할게요
              </TimeItemLabel>
            </TimeItem>
          </TouchableWithoutFeedback>
        </TimeList>
      </Container>

      <Actions>
        <Button
          onPress={handlePressComplete}
          loading={loading}
          label="완료"
          size={ButtonSize.Large}
        />
      </Actions>

      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        swipeDirection="down"
        propagateSwipe
        style={{ justifyContent: 'flex-end', margin: 0 }}
      >
        <DateTimePicker
          initialDate={
            activeTimeIndex === timeList.length
              ? notificationDate.date
              : undefined
          }
          setManualTime={setManualTime}
        />
      </Modal>
    </>
  );
}

const Container = styled.View`
  padding: 0 16px;
  flex: 1;
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

const TimeList = styled.ScrollView``;

const TimeItem = styled.View<{ active: boolean }>`
  height: 48px;
  padding: 0 16px;
  border-radius: 8px;
  margin: 8px 0;
  align-items: center;
  justify-content: center;

  ${(props) => props.active
    && css`
      background-color: ${props.theme.colors.primaryTender};
    `}
`;

const TimeItemLabel = styled.Text<{ active: boolean }>`
  color: ${(props) => props.theme.colors.typography.secondary};
  font-size: 20px;

  ${(props) => props.active
    && css`
      color: ${props.theme.colors.primary};
    `}
`;

export default Step4;
