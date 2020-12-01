import {
  SDK_SETTINGS_SET_VISITOR_ID,
  SDK_SETTINGS_SET_ENV_ID,
  SDK_SETTINGS_SET_VISITOR_CONTEXT,
  SDK_SETTINGS_RESET,
  SDK_SETTINGS_UPDATE_CONFIG,
} from './../../glossary';
import {
  SetEnvIdAction,
  SetVisitorIdAction,
  visitorContextElement,
  SetVisitorContextAction,
  SdkSettingsState,
} from './types';

export const setEnvIdAction = (id: string): SetEnvIdAction => {
  return {
    type: SDK_SETTINGS_SET_ENV_ID,
    payload: id,
  };
};

export const setVisitorIdAction = (id: string): SetVisitorIdAction => {
  return {
    type: SDK_SETTINGS_SET_VISITOR_ID,
    payload: id,
  };
};

export const updateConfig = (
  newConfig: SdkSettingsState,
): {type: string; payload: any} => {
  return {
    type: SDK_SETTINGS_UPDATE_CONFIG,
    payload: {...newConfig},
  };
};

export const resetSettings = () => {
  return {
    type: SDK_SETTINGS_RESET,
  };
};

export const setVisitorContextAction = (
  context: Array<visitorContextElement>,
): SetVisitorContextAction => {
  return {
    type: SDK_SETTINGS_SET_VISITOR_CONTEXT,
    payload: context,
  };
};
