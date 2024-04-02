import React from 'react';
import { SidebarAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { Button, Paragraph } from '@contentful/f36-components';
import { useState } from 'react';

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();
  const parameters = sdk.parameters.installation as any;
  const [active, setActive] = useState(false);

  return (
    <>
      <Button isFullWidth isLoading={active} onClick={async () => {
        setActive(true);
        const status = await fetch(parameters.deployHook, {
          method: 'POST',
        });
        setActive(false);
        
        if (status.status !== 201) {
          sdk.notifier.error('Something went wrong!');
          return;
        }
        sdk.notifier.success('Build started!  Review in your hosting provider to confirm it has gone live.');
      }}>
        {parameters.deployButtonLabel || 'Deploy'}
      </Button>
      <Paragraph marginTop="spacingS">Deploy your site.  Please ensure that all content you need to go live is published.</Paragraph>
    </>
  );
};

export default Sidebar;
