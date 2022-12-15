import React from "react";
import { useDialog } from "../../store/dialogStore";
import ScreenOverlay from "../ScreenOverlay/ScreenOverlay";
import "./Dialog.scss";

interface IDialogProps {
  title: string;
  subTitle: string;
  mainActionTitle: string;
  sideActionTitle?: string;
  onMainActionClick?: () => void;
  onSideActionClick?: () => void;
  onDismiss?: () => void;
}

function Dialog(props: IDialogProps) {
  const dismissDialog = useDialog((state) => state.dismissDialog);

  return (
    <>
      <ScreenOverlay onClick={dismissDialog} />
      <div className="Dialog">
        <h1 className="title Dialog__title">{props.title}</h1>
        <p className="subTitle Dialog__subTitle">{props.subTitle}</p>
        <div className="Dialog__actions">
          <button
            type="button"
            className="textBtn Dialog__actions__side"
            onClick={props.onSideActionClick}
          >
            {props.sideActionTitle}
          </button>
          <button
            type="button"
            className="btn Dialog__actions__main"
            onClick={props.onMainActionClick}
          >
            <span>{props.mainActionTitle}</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Dialog;
