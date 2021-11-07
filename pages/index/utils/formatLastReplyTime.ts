import { format, formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

const aWeekAgo = new Date();
aWeekAgo.setDate(aWeekAgo.getDate() - 7);

const formatLastReplyTime = (timeStr: string | number) => {
  const date = new Date(Number(timeStr) * 1000);
  if (date <= aWeekAgo) return format(date, 'yyyy-MM-dd HH:mm', { locale: zhCN });
  return `${formatDistanceToNow(date, { locale: zhCN }).replace('大约', '')}前`;
};

export default formatLastReplyTime;
