import React from 'react';
import { createPortal } from 'react-dom';
import style from './Popup.module.scss';

type PopupProps = {
  open: boolean;
  onClose: () => void;
};

const wrapper = document.createElement('div');
document.body.appendChild(wrapper);

const Popup: React.FC<PopupProps> = ({ children, open, onClose }) => {
  if (!open) {
    return null;
  }
  return createPortal(
    <div className={style.container}>
      <div className={style.overlay} onClick={onClose} />
      <div className={style.content}>{children}</div>
    </div>,
    wrapper
  );
};

export function popupHoc<T>(
  Component: React.FC<T>,
  getProps: (
    props: T
  ) => {
    open: boolean;
    onClose: () => void;
  }
) {
  return (props: T) => (
    <Popup {...getProps(props)}>
      <Component {...props} />
    </Popup>
  );
}
export default Popup;
