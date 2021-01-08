import dayjs from 'dayjs';

function calculateTimeLeft(time: string) {
  const now = dayjs();
  const deadline = dayjs(time).add(14, 'day');

  const day = deadline.diff(now, 'day');
  const hour = deadline.diff(now, 'hour');
  const minute = deadline.diff(now, 'minute');
  const second = deadline.diff(now, 'second');

  let label = `${day}일 남음`;
  let detailLabel = `🌱 ${day}일 남았어요!`;

  if (day < 7) {
    detailLabel = `🌼 ${day}일 남았어요!`;
  }

  if (hour < 24) {
    label = `${hour}시간 남음`;
    detailLabel = `🔥 ${hour}시간 남았어요!`;
  }

  if (hour < 3) {
    label = `${hour}시간 ${minute % 60}분 남음`;
    detailLabel = `🔥 ${hour}시간 ${minute % 60}분 남았어요!`;
  }

  if (hour < 1) {
    label = `${minute}분 남음`;
    detailLabel = `🔥 ${minute % 60}분 남았어요!`;
  }

  return {
    second,
    day,
    hour,
    minute,
    label,
    detailLabel,
  };
}

export default calculateTimeLeft;
