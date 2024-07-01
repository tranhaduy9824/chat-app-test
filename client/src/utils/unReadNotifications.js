export const unReadNotificationsFunc = (notifications) => {
  return notifications.filter((n) => n.isRead === false);
};
