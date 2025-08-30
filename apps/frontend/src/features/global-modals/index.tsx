import React from 'react';
import { GLOBAL_MODAL } from './types';
import BetModal from './bet-modal';

const GlobalModals = ({
  iid,
  modal,
}: {
  iid?: number;
  modal?: GLOBAL_MODAL;
}) => {
  return (
    <>
      <BetModal iid={iid} modal={modal} />
    </>
  );
};

export default GlobalModals;
