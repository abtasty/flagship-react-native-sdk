import {FlagshipSdkConfig} from '@flagship.io/js-sdk';

export interface SdkSettingsState extends FlagshipSdkConfig {
  envId: string | undefined;
  visitorId: string | undefined;
  isAuthenticated: boolean;
  visitorContext: Array<visitorContextElement>;
  fetchNow: boolean;
  pollingInterval: number | null;
  activateNow: boolean;
  enableConsoleLogs: boolean;
  enableErrorLayout: boolean;
  nodeEnv: string;
  flagshipApi: string;
  apiKey: null | string;
}

export type SetEnvIdAction = {
  type: string;
  payload: string;
};

export type SetVisitorIdAction = {
  type: string;
  payload: string;
};

export type SetVisitorContextAction = {
  type: string;
  payload: Array<visitorContextElement>;
};

export type SetFsModificationsAction = {
  type: string;
  payload: Array<any>;
};

export type visitorContextElement = {
  key: string;
  value: string | number | boolean;
  type: string;
};

export type SdkSettingsAction =
  | SetEnvIdAction
  | SetVisitorIdAction
  | SetVisitorContextAction
  | SetFsModificationsAction;
