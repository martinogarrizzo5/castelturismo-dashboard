import { Outlet } from "react-router-dom";
import Dialog from "../../components/Dialog/Dialog";
import SideBar from "../../components/SideBar/SideBar";
import { useDialog } from "../../store/dialogStore";
import "./Dashboard.scss";

function DashboardScreen() {
  const dialogState = useDialog();

  return (
    <div className="Dashboard">
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
