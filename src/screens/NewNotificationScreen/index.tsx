import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import dayjs from 'dayjs';
import React, {
  ReactElement, useCallback, useEffect, useState,
} from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import styled, { css } from 'styled-components/native';

import BottomModal from '../../components/BottomModal';
import Button, { ButtonSize } from '../../components/Button';
import { RootStackParamList, TabParamList } from '../../config/Navigation';
import useArticle from '../../features/article/useArticle';
import useNotificationPermission, { PermissionStatus } from '../../lib/hooks/useNotificationPermission';
import DateTimePicker from './DateTimePicker';
import PermissionSettingGuide from './PermissionSettingGuide';
import ScreenHeader from './ScreenHeader';

export interface Step4Props {
  nextStep: () => void;
}

const timeList = [
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
  date: dayjs(),
  fromNow: '',
  dateStr: '',
};

interface NotificationTime {
  date: dayjs.Dayjs;
  fromNow: string;
  dateStr: string;
}

function NewNotificationScreen(): ReactElement {
  const route = useRoute<RouteProp<RootStackParamList, 'NewNotification'>>();
  const navigation = useNavigation<
    StackNavigationProp<RootStackParamList & TabParamList>
  >();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTimeIndex, setActiveTimeIndex] = useState<number>();
  const [notificationDate, setNotificationDate] = useState<NotificationTime>(
    initialNotificationTime,
  );
  const { permissionStatus, requestPermissions } = useNotificationPermission();
  const [now] = useState(dayjs());
  const { addCustomScheduledNotification } = useArticle();

  const { article } = route.params;

  const handlePressTime = useCallback(
    (hour: number, index: number) => {
      setActiveTimeIndex(index);

      const date = dayjs(now).add(hour, 'h');
      setNotificationDate(formatTimeFromNow(now, date));
    },
    [now],
  );

  useEffect(() => {
    handlePressTime(2, 1);
  }, [handlePressTime]);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const setManualTime = (date: dayjs.Dayjs) => {
    setModalVisible(false);
    setActiveTimeIndex(timeList.length);
    setNotificationDate(formatTimeFromNow(now, date));
  };

  const handlePressComplete = useCallback(async () => {
    setLoading(true);

    if (permissionStatus === PermissionStatus.UNDETERMINED) {
      const status = await requestPermissions();

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // status의 type은 PermissionStatus 이지만 실제 값은 0/1이 반환 됨
      if (status === PermissionStatus.DENIED || status === 0) {
        setLoading(false);
        return;
      }
    }

    await addCustomScheduledNotification({
      article,
      date: notificationDate.date.toDate(),
    });

    if (route.params.isNewArticle) {
      navigation.navigate('Home', {
        setScrollBottom: true,
        setScrollTop: false,
        openPendingList: false,
      });
      return;
    }
    navigation.pop();
  }, [
    requestPermissions,
    permissionStatus,
    notificationDate,
    route,
    article,
    navigation,
    addCustomScheduledNotification,
  ]);

  if (permissionStatus === PermissionStatus.DENIED) {
    return <PermissionSettingGuide />;
  }

  return (
    <Container>
      <ScreenHeader />
      <Main>
        <Header>
          <TimeFromNow>{notificationDate.fromNow}</TimeFromNow>
          <Time>{notificationDate.dateStr}</Time>
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
          <TouchableWithoutFeedback onPress={openModal}>
            <TimeItem active={activeTimeIndex === timeList.length}>
              <TimeItemLabel active={activeTimeIndex === timeList.length}>
                {activeTimeIndex === timeList.length
                  ? notificationDate.dateStr
                  : '직접 선택'}
              </TimeItemLabel>
            </TimeItem>
          </TouchableWithoutFeedback>
        </TimeList>

        <Actions>
          <Button
            onPress={handlePressComplete}
            loading={loading}
            label="완료"
            size={ButtonSize.Large}
          />
        </Actions>
      </Main>

      <BottomModal
        isVisible={modalVisible}
        onClose={closeModal}
      >
        <DateTimePicker
          initialDate={
            activeTimeIndex === timeList.length
              ? notificationDate.date
              : undefined
          }
          setManualTime={setManualTime}
          articleCreatedAt={article.createdAt}
          visible={modalVisible}
        />
      </BottomModal>
    </Container>
  );
}

const Container = styled.SafeAreaView`
  flex: 1;
`;

const Main = styled.View`
  flex: 1;
  padding: 0 16px 72px 16px;
`;

const Header = styled.View`
  height: 120px;
  justify-content: center;
  align-items: center;
`;

const TimeFromNow = styled.Text`
  font-size: 22px;
  color: ${(props) => props.theme.colors.typography.primary};
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
      color: ${props.theme.colors.typography.point};
    `}
`;

const Actions = styled.View`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px;
  height: ${64 + 16 + 16}px;
`;

export default NewNotificationScreen;
