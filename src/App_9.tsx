import React, { useState } from "react";
import {
  DappConnect,
  DappConnectCallbackParams,
  WalletMethodMap,
} from "@web3mq/dapp-connect";
import { generateQrCode } from "@web3mq/dapp-connect-react";

const App: React.FC = () => {
  const [client, setClient] = useState<DappConnect>();
  const [walletAddress, setWalletAddress] = useState("");
  const [qrCodeImg, setQrCodeImg] = useState("");
  const [signRes, setSignRes] = useState("");
  const [showLink, setShowLink] = useState(false);
  const [showOpenButton, setShowOpenButton] = useState(false);

  const handleDappConnectCallback = async (
    event: DappConnectCallbackParams
  ) => {
    console.log(event, "event - handleDappConnectCallback");
    console.log(JSON.stringify(event));
    const { type, data } = event;
    if (data.approve) {
      if (type === "connect") {
        console.log("ws connect success");
        setShowLink(true);
        return;
      }
      if (type === "dapp-connect") {
        const metadata = data.metadata;
        if (data.method === WalletMethodMap.providerAuthorization) {
          console.log(
            "connect success, wallet address is : ",
            metadata?.address
          );
          setWalletAddress(metadata?.address || "");
        }
        if (data.method === WalletMethodMap.personalSign) {
          console.log("sign success: ", metadata?.signature);
          setSignRes(metadata?.signature || "");
          setShowOpenButton(false)
        }
      }
    } else {
      console.log(`wallet response error: 
       code is: ${data.code}, 
       message is :${data.message}
       `);
      setWalletAddress("");
      setSignRes("");
      setQrCodeImg("");
    }
  };
  const init = async () => {
    const dappConnectClient = new DappConnect(
      {
        dAppID: "SwapChat:im",
        keepAlive: false,
        requestTimeout: 60000,
        env: "dev",
      },
      handleDappConnectCallback
    );
    console.log("the dapp-connect client: ", dappConnectClient);
    setClient(dappConnectClient);
  };
  const sign = async () => {
    await client?.sendSign({
      signContent: "test sign out",
      address: walletAddress || "",
      needJump: isMobile(),
    });
    setShowOpenButton(true)
  };
  const createLink = async () => {
    const mode = isMobile() ? "mobile" : "pc";
    const link = client?.getConnectLink({
      mode,
    });
    if (link) {
      if (mode === "pc") {
        const qrCode = await generateQrCode(link);
        setQrCodeImg(qrCode);
      } else {
        window.open(link);
      }
    }
  };

  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  return (
    <div>
      <div>
        <button onClick={init}>init</button>
      </div>
      {showLink && (
        <div>
          <div>
            <button onClick={createLink}>create link</button>
          </div>
          <div>
            <button onClick={sign}>send Sign</button>
          </div>
        </div>
      )}

      {
        showOpenButton &&  <div>
            <button onClick={() => {
              window.open('web3mq://')
            }}>open wallet</button>
          </div>
      }

      <div>
        {qrCodeImg && (
          <img
            src={qrCodeImg}
            style={{
              width: "200px",
              height: "200px",
            }}
            alt=""
          />
        )}
      </div>
      <div>
        {walletAddress && (
          <p>{"connect success, wallet address is : " + walletAddress}</p>
        )}
      </div>
      <div>{signRes && <p> signature: {signRes} </p>}</div>
    </div>
  );
};

export default App;
