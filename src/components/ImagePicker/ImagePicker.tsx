import classNames from "classnames";
import React, { useState, useRef } from "react";
import { ReactComponent as UploadSvg } from "../../assets/icons/upload.svg";
import "./ImagePicker.scss";

interface IImagePickerProps {
  className?: string;
  onImagesChange: (newPhotos: FileList | null) => void;
  multipleFiles?: boolean;
  onImageDelete?: (index: number) => void;
}

function ImagePicker(props: IImagePickerProps) {
  const fileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (fileInput.current) {
      fileInput.current.value = ""; // allow to re-upload a deleted image
      fileInput.current.click();
    }
  };

  return (
    <div className="ImagePicker">
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple={props.multipleFiles}
        onChange={(event) => props.onImagesChange(event.target.files)}
        className="ImagePicker__input"
      />
      <button
        onClick={handleClick}
        className={classNames("btn ImagePicker__button", props.className)}
      >
        <UploadSvg className="btn__icon" />
        <span>Carica</span>
      </button>
    </div>
  );
}

export default ImagePicker;
