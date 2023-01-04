import React, {useEffect, useMemo, useState} from 'react';
import { Button, ButtonType } from 'web3-mq-react';
import { CloseEyesIcon, LoginErrorIcon, MetaMaskIcon, OpenEyesIcon } from '../../../../icons';
import ss from './index.module.scss';
import { getShortAddress } from '../../../../utils';

interface IProps {
  getEthAccount: () => Promise<AddressRes>;
  login: () => Promise<LoginRes>;
  register: () => Promise<boolean>;
  setHeaderTitle: any
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

const loginText = {
  title: 'Enter password',
  subTitle:
    'Please enter your password associated with the wallet above to access your Web3MQ account.',
};
const signUpText = {
  title: 'Create password',
  subTitle: 'This password will be used to generate encryption keys for communicating with Web3MQ.',
};

const StepTwo: React.FC<IProps> = (props) => {
  const { getEthAccount, login, register, setHeaderTitle} = props;
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorInfo, setErrorInfo] = useState<string>();
  const [address, setAddress] = useState('');
  const [userExits, setUserExits] = useState(false);


  const isDisable = useMemo(() => {
    let res = !password;
    if (!userExits) {
      res = !password || !confirmPassword;
      if (!res) {
        res = password !== confirmPassword;
      }
    }

    return res;
  }, [password, userExits, confirmPassword]);

  const init = async () =>{
    const accountRes = await getEthAccount();
    if (accountRes.userExits) {
      setHeaderTitle('Log in');
    } else {
      setHeaderTitle('Sign up');
    }
    setAddress(accountRes.address)
    setUserExits(accountRes.userExits)
  }
  useEffect(() => {
    init()
  }, []);


  const handleSubmit = async () => {
    if (userExits) {
      const res = await login();
      if (!res.success && res.msg) {
        setErrorInfo(res.msg);
      }
    } else {
      if (password !== confirmPassword) {
        setErrorInfo("Passwords don't match. Please check your password inputs.");
      }

      const registerRes = await register();
      console.log(registerRes, 'registerRes');
    }
  };

  return (
    <div className={ss.stepTwo}>
      <div className={ss.addressBox}>
        <MetaMaskIcon />
        <div className={ss.centerText}>MetaMask</div>
        <div className={ss.addressText}>{getShortAddress(address)}</div>
      </div>
      <div className={ss.textBox}>
        <div className={ss.title}>{userExits ? loginText.title : signUpText.title}</div>
        <div className={ss.subTitle}>{userExits ? loginText.subTitle : signUpText.subTitle}</div>
      </div>
      <div className={ss.inputContainer}>
        <div className={ss.inputBox}>
          <div className={ss.title}>Password</div>
          <div className={ss.inputValue}>
            <input
              placeholder="Write something..."
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            {showPassword ? (
              <div
                className={ss.eyesBox}
                onClick={() => {
                  setShowPassword(false);
                }}
              >
                <OpenEyesIcon />{' '}
              </div>
            ) : (
              <div
                className={ss.eyesBox}
                onClick={() => {
                  setShowPassword(true);
                }}
              >
                <CloseEyesIcon />{' '}
              </div>
            )}
          </div>
        </div>
        {!userExits && (
          <div className={ss.inputBox}>
            <div className={ss.title}>Confirm password</div>
            <div className={ss.inputValue}>
              <input
                placeholder="Write something..."
                type={showPassword2 ? 'text' : 'password'}
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
              {showPassword2 ? (
                <div
                  className={ss.eyesBox}
                  onClick={() => {
                    setShowPassword2(false);
                  }}
                >
                  <OpenEyesIcon />{' '}
                </div>
              ) : (
                <div
                  className={ss.eyesBox}
                  onClick={() => {
                    setShowPassword2(true);
                  }}
                >
                  <CloseEyesIcon />{' '}
                </div>
              )}
            </div>
          </div>
        )}
        {errorInfo && (
          <div className={ss.errorBox}>
            <div className={ss.errorIcon}>
              <LoginErrorIcon />
            </div>
            <div>{errorInfo}</div>
          </div>
        )}
        {!userExits && (
          <div className={ss.tipsText}>
            <div>The Web3MQ network does not save your password.</div>
            <div>
              Please save it securely. If you lose your password, you will need to reset it, and you
              will be unable to decrypt previous messages.
            </div>
          </div>
        )}
      </div>
      <div className={ss.btnBox}>
        <Button
          className={ss.button}
          disable={isDisable}
          btnType={ButtonType.primary}
          onClick={handleSubmit}
        >
          {userExits ? 'Log in' : 'Create new user'}
        </Button>
      </div>
    </div>
  );
};

export default StepTwo;
