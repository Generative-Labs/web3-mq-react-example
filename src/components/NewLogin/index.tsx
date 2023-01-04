import React, { useCallback, useMemo, useState } from 'react';
import { AppTypeEnum, Button, ButtonType, Modal } from 'web3-mq-react';
import useToggle from '../../hooks/useToggle';
import {
  CheveronLeft,
  CloseBtnIcon,
  CloseEyesIcon,
  LoginErrorIcon,
  MetaMaskIcon,
  OpenEyesIcon,
} from '../../icons';
import ss from './index.module.scss';
import { getShortAddress } from '../../utils';
import StepOne from "./components/StepOne";
import StepTwo from "./components/StepTwo";

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

const NewLogin: React.FC<IProps> = (props) => {
  const [visible, show, hide] = useToggle();
  const { getEthAccount, login, register } = props;
  const [step, setStep] = useState(1);
  const [headerTitle, setHeaderTitle] = useState('Log in');
  // 渲染列表列
  const handleModalShow = async () => {
    show();
    setStep(1)
  };
  const handleClose = () => {
    hide();
  };
  const handleBack = () => {
      setHeaderTitle('Connect Dapp')
    setStep(1);
  };
  const ModalHead = useCallback(
    () => (
      <div className={ss.loginModalHead}>
        <CheveronLeft onClick={handleBack} className={ss.backBtn} />
        <div className={ss.title}>{headerTitle}</div>
        <CloseBtnIcon onClick={handleClose} className={ss.closeBtn} />
      </div>
    ),
    [headerTitle],
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
          {
            [1,2].includes(step) && <StepOne step={step} setHeaderTitle={setHeaderTitle} setStep={setStep} />
          }
          {
            step === 3 && <StepTwo login={login} register={register} getEthAccount={getEthAccount} setHeaderTitle={setHeaderTitle} />
          }
        </div>
      </Modal>
    </div>
  );
};

export default NewLogin;
