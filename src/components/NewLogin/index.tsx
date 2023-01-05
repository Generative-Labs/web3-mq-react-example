import React, { useCallback, useState } from 'react';
import { AppTypeEnum, Button, Modal } from 'web3-mq-react';
import useToggle from '../../hooks/useToggle';
import {
  CheveronLeft,
  CloseBtnIcon,
} from '../../icons';
import ss from './index.module.scss';
import StepOne from './components/StepOne';
import StepTwo from './components/StepTwo';

interface IProps {
  getEthAccount: () => Promise<AddressRes>;
  login: () => Promise<LoginRes>;
  register: () => Promise<boolean>;
}

export interface AddressRes {
  address: string;
  userExits: boolean;
}

export interface LoginRes {
  success: boolean;
  msg: string;
  code: number;
}

export enum StepStringEnum {
  HOME = 'home',
  VIEW_ALL = 'view_all_desktop',
  LOGIN_MODAL = 'login_modal',
}

const NewLogin: React.FC<IProps> = (props) => {
  const [visible, show, hide] = useToggle();
  const { getEthAccount, login, register } = props;
  const [step, setStep] = useState(StepStringEnum.HOME);
  const [headerTitle, setHeaderTitle] = useState('Log in');
  // 渲染列表列
  const handleModalShow = async () => {
    show();
    setStep(StepStringEnum.HOME);
  };
  const handleClose = () => {
    hide();
  };
  const handleBack = () => {
    setHeaderTitle('Connect Dapp');
    setStep(StepStringEnum.HOME);
  };
  const ModalHead = useCallback(
    () => (
      <div className={ss.loginModalHead}>
        { step !== StepStringEnum.HOME && <CheveronLeft onClick={handleBack} className={ss.backBtn} /> }
        <div className={ss.title}>{headerTitle}</div>
        <CloseBtnIcon onClick={handleClose} className={ss.closeBtn} />
      </div>
    ),
    [headerTitle, step],
  );

  return (
    <div className={ss.container}>
      <Button className={ss.iconBtn} onClick={handleModalShow}>
        Login
      </Button>
      <Modal
        appType={AppTypeEnum.pc}
        visible={visible}
        closeModal={hide}
        modalHeader={<ModalHead />}
      >
        <div className={ss.modalBody}>
          {[StepStringEnum.HOME, StepStringEnum.VIEW_ALL].includes(step) && (
            <StepOne step={step} setHeaderTitle={setHeaderTitle} setStep={setStep} />
          )}
          {step === StepStringEnum.LOGIN_MODAL && (
            <StepTwo
              login={login}
              register={register}
              getEthAccount={getEthAccount}
              setHeaderTitle={setHeaderTitle}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default NewLogin;
