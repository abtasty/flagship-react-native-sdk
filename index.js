import {
    FlagshipProvider as ReactFlagshipProvider,
    useFlagship,
    useFsActivate,
    useFsModifications
} from '@flagship.io/react-sdk';
import React, { useEffect, useRef } from 'react';
import { Button, SafeAreaView, Text, View } from 'react-native';

import ErrorBoundary from './lib/ErrorBoundary';
import FsLogger from './lib/FsLogger';
import {
    getCacheFromPhone,
    setModificationsCacheFromPhone,
    setBucketingCacheFromPhone,
    setVisitorReconciliationInCache
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
    enableClientCache,
    onUpdate,
    onBucketingSuccess,
    nodeEnv,
    timeout, // TODO: freeze at the moment
    visitorData,
    ...otherProps
}) => {
    const enableClientCacheValue =
        !enableClientCache && typeof enableClientCache !== 'boolean'
            ? true
            : enableClientCache;
    const [state, setState] = React.useState({
        ...initState,
        log: FsLogger.getLogger({ nodeEnv, enableConsoleLogs })
    });

    const determineVisitorId = () => {
        // check if defined
        if (!visitorData.id) {
            // check if something local storage
            if (state.phoneCache?.visitor?.id) {
                return state.phoneCache.visitor.id;
            }
            // return random generated visitor id otherwise
            return FlagshipCommon.createVisitorId();
        }

        // return the defined value otherwise
        return visitorData.id;
    };

    const visitorIdValue = determineVisitorId();
    const previousVisitorId = useRef();
    // NOTE: temporary code (should be replace by code from JS SDK)
    const previousIsAuthenticated = useRef(
        visitorData.isAuthenticated || false
    );

    useEffect(() => {
        // do nothing if cache not enabled
        if (!enableClientCacheValue) {
            return;
        }

        const isBeingAuthenticated =
            previousIsAuthenticated.current === false &&
            visitorData.isAuthenticated === true;
        const isBeingAnonymous =
            previousIsAuthenticated.current === true &&
            visitorData.isAuthenticated === false;
        previousIsAuthenticated.current = visitorData.isAuthenticated; // refresh the value
        if (isBeingAuthenticated) {
            setVisitorReconciliationInCache(
                {
                    id: visitorIdValue,
                    anonymousId: previousVisitorId.current || null
                },
                state.log
            );
        } else if (isBeingAnonymous) {
            setVisitorReconciliationInCache(
                { id: visitorIdValue, anonymousId: null },
                state.log
            );
        }
        previousVisitorId.current = visitorIdValue;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visitorData.isAuthenticated, visitorData.id]);

    // Check the envId
    if (!checkValidityPatternForEnvId(envId)) {
        if (onError) {
            onError();
        }
        return <ErrorBoundary>{children}</ErrorBoundary>;
    }

    // NOTE: with freeze (few ms) + load cache only once
    if (state.isLoadingCache) {
        getCacheFromPhone(state.log)
            .then((data) =>
                setState({
                    ...state,
                    isLoadingCache: false,
                    phoneCache: {
                        modifications: data.modifications,
                        bucketing: data.bucketing,
                        visitor: data.visitor
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

    const determineVisitorAnonymousId = () => {
        // check if something local storage
        if (state.phoneCache?.visitor?.anonymousId) {
            return state.phoneCache.visitor.anonymousId;
        }

        // null otherwise
        return null;
    };

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
                // enableClientCache={enableClientCacheValue} // NOTE: not needed because handled at this level
                enableConsoleLogs={enableConsoleLogs}
                nodeEnv={nodeEnv}
                reactNative={{
                    anonymousId: determineVisitorAnonymousId(),
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
                            axiosFct()
                                .then((data) => {
                                    clearTimeout(tempTimeout);
                                    resolve(data);
                                })
                                .catch((e) => {
                                    clearTimeout(tempTimeout);
                                    reject(e);
                                });
                        });
                    }
                }}
                visitorData={{
                    ...visitorData,
                    id: visitorIdValue
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
