import {
    FlagshipProvider as ReactFlagshipProvider,
    useFlagship,
    useFsActivate,
    useFsModifications
} from '@flagship.io/react-sdk';
import React from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';

import ErrorBoundary from './lib/ErrorBoundary';
import FsLogger from './lib/FsLogger';
import {
    getCacheFromPhone,
    setModificationsCacheFromPhone,
    setBucketingCacheFromPhone
} from './lib/FSStorage';
import {
    checkValidityPatternForEnvId,
    generateFlagshipId
} from './lib/FSTools';
import { FlagshipCommon } from '@flagship.io/js-sdk-logs';

const initState = {
    log: null,
    isLoadingCache: true,
    phoneCache: {
        modifications: null,
        bucketing: null
    }
};

const FsReactNativeContext = React.createContext({
    state: { ...initState },
    setState: null
});

const displayReactNativeBoundary = ({
    debugMode,
    children,
    isCollapse,
    error,
    onClickCollapse
}) => {
    return (
        <>
            {debugMode && (
                <SafeAreaView>
                    <View
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            paddingTop: 8,
                            paddingBottom: 16,
                            backgroundColor: 'red'
                        }}
                    >
                        <Text style={{ color: 'white', fontSize: 16 }} />
                        <Button
                            onPress={onClickCollapse}
                            title={isCollapse ? 'Close view' : 'Safe mode: ON'}
                            color="white"
                        />
                    </View>
                    {isCollapse && (
                        <View>
                            <Text
                                style={{
                                    fontWeight: 'bold',
                                    fontSize: 20,
                                    marginTop: 16
                                }}
                            >
                                Details:
                            </Text>
                            <Text style={{ marginTop: 8 }}>{error.stack}</Text>
                        </View>
                    )}
                </SafeAreaView>
            )}
            {!isCollapse && children}
        </>
    );
};

const FlagshipProvider = ({
    children,
    envId,
    onError,
    enableConsoleLogs,
    onUpdate,
    onBucketingSuccess,
    nodeEnv,
    timeout, // TODO: freeze at the moment
    visitorData,
    ...otherProps
}) => {
    const [state, setState] = React.useState({
        ...initState,
        log: FsLogger.getLogger({ nodeEnv, enableConsoleLogs })
    });

    // Check the envId
    if (!checkValidityPatternForEnvId(envId)) {
        if (onError) {
            onError();
        }
        return <ErrorBoundary>{children}</ErrorBoundary>;
    }

    // with freeze (few ms)
    if (state.isLoadingCache) {
        getCacheFromPhone(state.log)
            .then((data) =>
                setState({
                    ...state,
                    isLoadingCache: false,
                    phoneCache: {
                        modifications: [...data.modifications],
                        bucketing: data.bucketing
                    }
                })
            )
            .catch((error) => {
                setState({
                    ...state,
                    isLoadingCache: false
                });
                state.log.warn('getCacheFromPhone - error: ' + error);
            });
        return null;
    }

    return (
        <FsReactNativeContext.Provider value={{ state, setState }}>
            <ReactFlagshipProvider
                {...otherProps}
                envId={envId}
                /* V1 */
                {...otherProps.config}
                /*  TODO: V2 */
                // onError  // NOTE: don't need to give to REACT SDK
                initialBucketing={state.phoneCache.bucketing}
                initialModifications={state.phoneCache.modifications}
                enableConsoleLogs={enableConsoleLogs}
                nodeEnv={nodeEnv}
                reactNative={{
                    handleErrorDisplay: displayReactNativeBoundary,
                    httpCallback: (axiosFct, cancelToken, { timeout }) => {
                        return new Promise((resolve, reject) => {
                            const tempTimeout = setTimeout(() => {
                                cancelToken.cancel();
                                reject(
                                    new Error(
                                        `Request has timed out (after ${
                                            timeout * 1000
                                        }ms).`
                                    )
                                );
                            }, timeout * 1000);
                            axiosFct().then((data) => {
                                clearTimeout(tempTimeout);
                                resolve(data);
                            });
                        });
                    }
                }}
                visitorData={{
                    ...visitorData,
                    id:
                        visitorData.id == null
                            ? FlagshipCommon.createVisitorId()
                            : visitorData.id
                }}
                // Update the modifications stored in device's cache
                onUpdate={(data, fsVisitor) => {
                    setModificationsCacheFromPhone(data, state.log);
                    onUpdate(data, fsVisitor);
                }}
                onBucketingSuccess={(data) => {
                    setBucketingCacheFromPhone(data, state.log);
                    onBucketingSuccess(data);
                }}
            >
                {children}
            </ReactFlagshipProvider>
        </FsReactNativeContext.Provider>
    );
};

// Flagship react native consumer
export const FsReactNativeConsumer = FsReactNativeContext.Consumer;

// Flagship Hooks
export { useFsActivate, useFsModifications, useFlagship };

// Flagship Provider overloaded
export default FlagshipProvider;
