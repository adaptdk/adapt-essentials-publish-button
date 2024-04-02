import React from 'react';
import { ConfigAppSDK } from '@contentful/app-sdk';
import { Flex, Form, Heading, Paragraph, TextInput, TextLink, FormControl } from '@contentful/f36-components';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
import { css } from 'emotion';
import { useCallback, useEffect, useState } from 'react';

export interface AppInstallationParameters {
  deployHook?: string,
  deployButtonLabel?: string,
}

const ConfigScreen = () => {
  const sdk = useSDK<ConfigAppSDK>();
  const [parameters, setParameters] = useState<AppInstallationParameters>({});
  const [invalid, setInvalid] = useState<boolean>(false);

  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  const onConfigure = useCallback(async () => {
    // This method will be called when a user clicks on "Install"
    // or "Save" in the configuration screen.
    // for more details see https://www.contentful.com/developers/docs/extensibility/ui-extensions/sdk-reference/#register-an-app-configuration-hook
  
    // Perform validation.
    if (!parameters.deployHook || !parameters.deployHook.trim()) {
      setInvalid(true);
      // Current state of the app is not valid.
      // Notify the user and return `false` so installation
      // is aborted.
      sdk.notifier.error("You must set a deploy hook.");
      return false;
    }

    // Get current the state of EditorInterface and other entities
    // related to this app installation
    const currentState = await sdk.app.getCurrentState();

    return {
      // Parameters to be persisted as the app configuration.
      parameters,
      // In case you don't want to submit any update to app
      // locations, you can just pass the currentState as is
      targetState: currentState,
    };
  }, [parameters, sdk]);

  useEffect(() => {
    // `onConfigure` allows to configure a callback to be
    // invoked when a user attempts to install the app or update
    // its configuration.
    sdk.app.onConfigure(() => onConfigure());
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      // Get current parameters of the app.
      // If the app is not installed yet, `parameters` will be `null`.
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      // Once preparation has finished, call `setReady` to hide
      // the loading screen and present the app to a user.
      sdk.app.setReady();
    })();
  }, [sdk]);

  return (
    <Flex flexDirection="column" className={css({ margin: '80px', maxWidth: '800px' })}>
      <Form>
        <Heading>Deploy Configuration</Heading>
        <Paragraph>
          Configure the deploy hook that will trigger your production environment to build.
          For information about how to create a webhook, check with your hosting provider.
          Common providers include: {' '}
          <ul>
            <li>
              <TextLink
                target='_blank'
                rel='noopener noreferrer'
                href="https://vercel.com/docs/more/deploy-hooks"
              >
                Vercel
              </TextLink>
            </li>
            <li>
              <TextLink
                target='_blank'
                rel='noopener noreferrer'
                href="https://docs.netlify.com/configure-builds/build-hooks/"
              >
                Netlify
              </TextLink>
            </li>
          </ul>

        </Paragraph>
        <FormControl isRequired isInvalid={invalid}>
          <FormControl.Label>Deploy Hook</FormControl.Label>
          <TextInput
            value={parameters.deployHook}
            type="text"
            name="deployHook"
            placeholder="https://api.vercel.com/v1/integrations/deploy/XXXX/XXXX"
            onChange={async (e) => {
              const value = e.target.value.trim();
              if (!value) {
                setInvalid(true);
              } else {
                setInvalid(false);
              }
              setParameters({...parameters, deployHook: e.target.value})
            }}
          />
          <FormControl.HelpText>Your Vercel deploy hook</FormControl.HelpText>
          {invalid && (
            <FormControl.ValidationMessage>
              This field is required
            </FormControl.ValidationMessage>
          )}
        </FormControl>
        <FormControl>
          <FormControl.Label>Button Label</FormControl.Label>
          <TextInput
            value={parameters.deployButtonLabel}
            type="text"
            name="deployButtonLabel"
            placeholder="Deploy"
            onChange={async (e) => {
              const value = e.target.value.trim();
              if (!value) {
                setInvalid(true);
              } else {
                setInvalid(false);
              }
              setParameters({...parameters, deployButtonLabel: e.target.value})
            }}
          />
          <FormControl.HelpText>The text for the deploy button</FormControl.HelpText>
        </FormControl>
      </Form>
    </Flex>
  );
};

export default ConfigScreen;
