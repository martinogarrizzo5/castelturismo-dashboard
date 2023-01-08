import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import {
  useNotification,
  NotificationType,
} from "../../store/notificationStore";
import "./Notification.scss";

interface INotificationProps {
  message: string | null;
  type: NotificationType | null;
}

function Notification(props: INotificationProps) {
  const notificationState = useNotification();
  let timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (notificationState.isShown) {
      if (timer.current) clearTimeout(timer.current);

      timer.current = setTimeout(() => {
        notificationState.dismissNotification();
      }, 4000);
    }
  }, [notificationState]);

  return (
    <div
      className={classNames(
        "Notification",
        props.type === NotificationType.Success && "Notification--success",
        props.type === NotificationType.Error && "Notification--error"
      )}
    >
      <span className="Notification__icon"></span>
      <span>{props.message}</span>
    </div>
  );
}

export default Notification;
