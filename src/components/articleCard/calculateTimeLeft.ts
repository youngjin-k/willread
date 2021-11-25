import dayjs from 'dayjs';

function calculateTimeLeft(expiredAt: string) {
  const now = dayjs();
  const deadline = dayjs(expiredAt);

  const day = deadline.diff(now, 'day');
  const hour = deadline.diff(now, 'hour');
  const minute = deadline.diff(now, 'minute');
  const second = deadline.diff(now, 'second');

  let label = `${day}일 남음`;
  let detailLabel = `🌱 보관 기간이 ${day}일 남았어요.`;

  if (day < 4) {
    detailLabel = `🌼 보관 기간이 ${day}일 남았어요.`;
  }

  if (hour < 24) {
    label = `${hour}시간 남음`;
    detailLabel = `🔥 보관 기간이 ${hour}시간 남았어요.`;
  }

  if (hour < 3) {
    label = `${hour}시간`;
    detailLabel = `🔥 보관 기간이 ${hour}시간`;

    if (minute % 60 > 0) {
      label += ` ${minute % 60}분`;
      detailLabel += ` ${minute % 60}분`;
    }
    label += ' 남음';
    detailLabel += ' 남았어요.';
  }

  if (hour < 1) {
    label = `${minute}분 남음`;
    detailLabel = `🔥 보관 기간이 ${minute}분 남았어요.`;
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
