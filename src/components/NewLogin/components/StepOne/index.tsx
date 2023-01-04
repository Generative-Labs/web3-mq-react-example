import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AppTypeEnum, Button, ButtonType, Modal } from 'web3-mq-react';

interface IProps {
  setStep: any;
  setHeaderTitle: any;
  step: number;
}

const StepOne: React.FC<IProps> = (props) => {
  const { setStep, setHeaderTitle, step } = props;
  useEffect(() => {
    setHeaderTitle('Connect Dapp');
  }, []);

  return (
    <div>
      {step === 1 && (
        <div>
          Step One
          <Button
            onClick={() => {
              setHeaderTitle('Choose Desktop wallets');
              setStep(2);
            }}
          >
            next
          </Button>
        </div>
      )}
      {step === 2 && (
        <div>
          Step two
          <Button
            onClick={() => {
              setStep(3);
            }}
          >
            next
          </Button>
        </div>
      )}
    </div>
  );
};

export default StepOne;
