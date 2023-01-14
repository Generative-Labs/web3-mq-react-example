import { useMemo, useState } from 'react';
import {Client, KeyPairsType, SignClientCallBackType, WalletType} from 'web3-mq';
import {message} from "antd";

const useLogin = () => {
  const hasKeys = useMemo(() => {
    const PrivateKey = localStorage.getItem('PRIVATE_KEY') || '';
    const PublicKey = localStorage.getItem('PUBLIC_KEY') || '';
    const userid = localStorage.getItem('userid') || '';
    if (PrivateKey && PublicKey && userid) {
      return { PrivateKey, PublicKey, userid };
    }
    return null;
  }, []);

  const [keys, setKeys] = useState<KeyPairsType | null>(hasKeys);
  const [fastestUrl, setFastUrl] = useState<string | null>(null);
  const [userAccount, setUserAccount] = useState<{
    userid: string;
    address: string;
  }>();

  const init = async () => {
    const tempPubkey = localStorage.getItem('PUBLIC_KEY') || '';
    const didKey = localStorage.getItem('DID_KEY') || '';
    const fastUrl = await Client.init({
      connectUrl: localStorage.getItem('FAST_URL'),
      app_key: 'vAUJTFXbBZRkEDRE',
      env: 'dev',
      didKey,
      tempPubkey,
    });
    localStorage.setItem('FAST_URL', fastUrl);
    setFastUrl(fastUrl);
  };

  const getAccount = async (didType: WalletType = 'eth') => {
    let { address } = await Client.register.getAccount(didType);
    const { userid, userExist } = await Client.register.getUserInfo({
      did_value: address,
      did_type: didType,
    });
    localStorage.setItem('userid', userid);
    setUserAccount({
      userid,
      address,
    });
    return {
      address,
      userid,
      userExist,
    };
  };

  const login = async (password: string, didType: WalletType = 'eth') => {
    if (!userAccount) {
      return;
    }

    const localMainPrivateKey = localStorage.getItem(`${didType}_MAIN_PRIVATE_KEY`) || '';
    const localMainPublicKey = localStorage.getItem(`${didType}_MAIN_PUBLIC_KEY`) || '';

    const { userid, address } = userAccount;
    const { TempPrivateKey, TempPublicKey, pubkeyExpiredTimestamp, mainPrivateKey, mainPublicKey } =
        await Client.register.login({
          password,
          userid,
          did_value: address,
          did_type: didType,
          mainPublicKey: localMainPublicKey,
          mainPrivateKey: localMainPrivateKey,
        });
    localStorage.setItem('PRIVATE_KEY', TempPrivateKey);
    localStorage.setItem('PUBLIC_KEY', TempPublicKey);
    localStorage.setItem(`${didType}_MAIN_PRIVATE_KEY`, mainPrivateKey);
    localStorage.setItem(`${didType}_MAIN_PUBLIC_KEY`, mainPublicKey);
    localStorage.setItem(`DID_KEY`, `${didType}:${address}`);
    localStorage.setItem('PUBKEY_EXPIRED_TIMESTAMP', String(pubkeyExpiredTimestamp));
    setKeys({
      PrivateKey: TempPrivateKey,
      PublicKey: TempPublicKey,
      userid,
    });
  };

  const register = async (password: string, didType: WalletType = 'eth') => {
    if (!userAccount) {
      return;
    }
    const { address, userid } = userAccount;
    const { mainPrivateKey, mainPublicKey } = await Client.register.register({
      password,
      did_value: address,
      userid,
      did_type: didType,
      avatar_url: `https://cdn.stamp.fyi/avatar/${address}?s=300`,
    });
    localStorage.setItem(`${didType}_MAIN_PRIVATE_KEY`, mainPrivateKey);
    localStorage.setItem(`${didType}_MAIN_PUBLIC_KEY`, mainPublicKey);
  };

  const logout = () => {
    localStorage.setItem('PRIVATE_KEY', '')
    localStorage.setItem('PUBLIC_KEY', '')
    localStorage.setItem('DID_KEY', '')
    localStorage.setItem('userid', '')
    setKeys(null);
  };

  const handleEvent = (options: SignClientCallBackType) => {
    const { type, data } = options;
    console.log(`${type} ====>`, data);
    if (type === 'keys') {
      const { private_key: PrivateKey, pubkey: PublicKey, userid } = data;
      localStorage.setItem('PRIVATE_KEY', PrivateKey);
      localStorage.setItem('PUBLICKEY', PublicKey);
      localStorage.setItem('USERID', userid);
      message.success('login success', 2).then(() => {
        setKeys({ PrivateKey, PublicKey, userid });
      });
    }
  };

  return { keys, fastestUrl, init, login, logout, getAccount, register, handleEvent, setKeys };
};

export default useLogin;

