import { Outlet } from "react-router-dom";
import Dialog from "../../components/Dialog/Dialog";
import Notification from "../../components/Notification/Notification";
import SideBar from "../../components/SideBar/SideBar";
import { useDialog } from "../../store/dialogStore";
import { useNotification } from "../../store/notificationStore";
import "./Dashboard.scss";

function DashboardScreen() {
  const dialogState = useDialog();
  const notificationState = useNotification();

  return (
    <div className="Dashboard">
      {notificationState.isShown && <Notification {...notificationState} />}
      <SideBar />
      <Outlet />
      {dialogState.isDialogShown && (
        <Dialog
          title={dialogState.dialog!.title}
          subTitle={dialogState.dialog!.subTitle}
          mainActionTitle={dialogState.dialog!.mainActionTitle}
          sideActionTitle={dialogState.dialog!.sideActionTitle}
          onMainActionClick={dialogState.dialog?.onMainActionClick}
          onSideActionClick={dialogState.dialog?.onSideActionClick}
          onDismiss={dialogState.dialog?.onDismiss}
        />
      )}
    </div>
  );
}

export default DashboardScreen;
