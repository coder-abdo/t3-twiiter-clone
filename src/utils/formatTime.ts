import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export const formatTime = (time: Date) => {
  dayjs.extend(relativeTime);
  return dayjs(time).fromNow();
};
