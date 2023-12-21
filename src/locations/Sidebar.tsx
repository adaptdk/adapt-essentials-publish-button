import React from 'react';
import { SidebarAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { Button } from '@contentful/f36-components';
import { useState } from 'react';

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();
  const parameters = sdk.parameters.installation as any;
  const [active, setActive] = useState(false);

  return <Button variant='positive' isLoading={active} onClick={async () => {
    setActive(true);
    const status = await fetch(parameters.vercelDeployHook, {
      method: 'POST',
    });
    setActive(false);
    
    if (status.status !== 201) {
      sdk.notifier.error('Something went wrong!');
      return;
    }
    console.log(await status.text());

    sdk.notifier.success('Build started!  Review in vercel to confirm it has gone live.');
  }}>{parameters.vercelDeployButtonLabel || 'Deploy'}</Button>;
};

export default Sidebar;
