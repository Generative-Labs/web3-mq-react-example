import { useState, useEffect, useCallback, useRef } from 'react';
import type { Client, EventTypes, operationFriendParams } from 'web3-mq';

type StatusType = {
  error: boolean;
  loading: boolean;
};

export const useLogin = (client: Client) => {
  const [notifications, setNotifications] = useState<any[] | null>([]);
  const [unReadCount, setUnReadCount] = useState<number | undefined>(undefined);

  const handleEvent = useCallback((props: { type: EventTypes }) => {
    const { type } = props;
    const { notificationList } = client.notify;
    if (!notificationList) return;
    // if (type === 'notification.messageNew') {
    //   // setUnReadCount(_unReadCount);
    //   return;
    // }
    if (type === 'notification.getList') {
      // notifyRef.current = Array.from(new Set(notificationList.map((item) => item.sender_id)));
      setNotifications(notificationList);
    }
  }, []);

  const handleFirendRequest = async (targetIUserid: string, action: any) => {
    const data = await client.contact.operationFriend(targetIUserid, action);
    console.log(data);
  };

  const readNotification = async () => {
    // await client.notify.changeNotificationStatus()
  };

  return {
    notifications,
    unReadCount,
    handleEvent,
    handleFirendRequest,
    readNotification,
  };
};
