# Flagship REACT NATIVE SDK - Release notes

## ➡️ Version 2.0.0

### New features 🎉

-   Panic mode supported. When you've enabled panic mode through the web dashboard, the SDK will detect it and be in safe mode. Logs will appear to warns you and default values for modifications will be return.

-   The visitor's modifications received either from bucketing or the decision api is saved in the phone cache automatically. This means, your visitor will still see the modifications when offline.

-   Now supports Bucketing behavior:
    -   `decisionMode` prop added, value is either "API" or "Bucketing".
    -   `pollingInterval` prop added, value is a number. Must be specified when `decisionMode=Bucketing`.

*   Add `initialBucketing` prop. It takes the data received from the flagship bucketing api endpoint. Can be useful when you save this data in cache.

*   Add `onBucketingSuccess` and `onBucketingFail` callback props. Those callbacks are called after a bucketing polling has either succeed or failed.

    Example:

    ```javascript
    <FlagshipProvider
        /* [...] */
        onBucketingSuccess={(bucketingData) => {
            // shape of bucketingData: { status: string; payload: BucketingApiResponse }
            console.log(
                'Bucketing polling succeed with following data: ' +
                    JSON.stringify(bucketingData)
            );
        }}
        onBucketingFail={(error) => {
            console.log(
                'Bucketing polling failed with following error: ' + error
            );
        }}
    >
        {children}
    </FlagshipProvider>
    ```

*   Add `startBucketingPolling` and `stopBucketingPolling` function available in `useFlagship` hook. It allows to start/stop the bucketing polling whenever you want.

    Example:

    ```javascript
    import { useFlagship } from '@flagship.io/react-sdk';

    const { startBucketingPolling, stopBucketingPolling } = useFlagship();

    // [...]

    return (
        <>
            <Button
                onClick={() => {
                    const { success, reason } = startBucketingPolling();
                    if (!success) {
                        console.log(
                            'startBucketingPolling failed because ' + reason
                        );
                    } else {
                        console.log('bucketing starts !');
                    }
                }}
            >
                Start the bucketing
            </Button>
            <Button
                onClick={() => {
                    const { success, reason } = stopBucketingPolling();
                    if (!success) {
                        console.log(
                            'stopBucketingPolling failed because ' + reason
                        );
                    } else {
                        console.log('bucketing stops !');
                    }
                }}
            >
                Stop the bucketing
            </Button>
        </>
    );
    ```

### Bug fixes 🐛

-   Bucketing is stopped automatically when value of `decisionMode` changes dynamically from `"Bucketing"` to another value.

-   When bucketing enabled, fix event's http request sent twice.

### Breaking changes #1 ⚠️

-   `config` prop is not supported anymore and has been deleted.

For example:

```
<FlagshipProvider
    config={{fetchNow: true, enableConsoleLogs: false}}
/>
```

is now:

```
<FlagshipProvider
    fetchNow={true}
    enableConsoleLogs={false}
/>
```

### Breaking changes #2 ⚠️

Be aware that `apiKey` will be mandatory in the next major release as it will use the [Decision API v2](http://developers.flagship.io/api/v2/).

-   Make sure to initialize your `FlagshipProvider` component is set correctly:

    -   **BEFORE**:

    ```javascript
        <FlagshipProvider
            envId="YOUR_ENV_ID"
            visitorData={{
                id: 'YOUR_VISITOR_ID',
                context: {}
            }}
        >
    ```

    -   **NOW**:

    ```javascript
        <FlagshipProvider
            envId="YOUR_ENV_ID"
            visitorData={{
                id: 'YOUR_VISITOR_ID',
                context: {}
            }}
            apiKey="YOUR_API_KEY" // <== Required in next major release
        >
    ```

### Breaking changes #3 ⚠️

-   `getModificationInfo` attribute from `useFlagship` hook, is now always defined:

    -   **BEFORE**:

        ```javascript
        import { useFlagship } from '@flagship.io/react-sdk';

        const { getModificationInfo } = useFlagship();

        // [...]

        return (
            <>
                <Button
                    onClick={() => {
                        if (getModificationInfo) {
                            console.log('Flagship SDK not ready !');
                        } else {
                            getModificationInfo(/* args... */).then((data) => {
                                if (data === null) {
                                    console.log(
                                        'getModificationInfo returns no data'
                                    );
                                } else {
                                    console.log(
                                        'getModificationInfo returns: ' + data
                                    );
                                }
                            });
                        }
                    }}
                >
                    Get the modification informations
                </Button>
            </>
        );
        ```

    -   **NOW**:

        ```javascript
        import { useFlagship } from '@flagship.io/react-sdk';

        const { getModificationInfo } = useFlagship();

        // [...]

        return (
            <>
                <Button
                    onClick={() => {
                        getModificationInfo(/* args... */).then((data) => {
                            if (data === null) {
                                console.log(
                                    'getModificationInfo returns no data'
                                );
                            } else {
                                console.log(
                                    'getModificationInfo returns: ' + data
                                );
                            }
                        });
                    }}
                >
                    Get the modification informations
                </Button>
            </>
        );
        ```

### Breaking changes #4 ⚠️

-   `fetchNow` prop is now `true` by default.

### Breaking changes #5 ⚠️

-   `useFsSynchronize` has been removed. Campaigns synchronization is now handle using `useFlagship` hook:


    -   **BEFORE**:

        ```jsx
        import { useFsSynchronize } from '@flagship.io/react-sdk';

        var activateAllModifications = false;

        useFsSynchronize([listenedValue], activateAllModifications); // when "listenedValue" changes, it triggers a synchronize

        // [...]

        return (
            <>
                <Button
                    onClick={() => {
                       // [...] (Update the value of "listenedValue" )
                    }}
                >
                    Test
                </Button>
            </>
        );
        ```

    -   **NOW**:

        ```jsx
        import { useFlagship } from '@flagship.io/react-sdk';

        var activateAllModifications = false;

        const { synchronizeModifications } = useFlagship();

        // [...]

        return (
            <>
                <Button
                    onClick={() => {
                        synchronizeModifications(activateAllModifications)
                            .then((statusCode) => {
                                if (statusCode < 300) {
                                    // Notify success...
                                } else {
                                    // Notify failure...
                                }
                            })
                            .catch((error) => {
                                // Notify error...
                            });
                    }}
                >
                    Trigger a synchronize
                </Button>
            </>
        )
        ```

## ➡️ Version 1.1.0

### New features 🎉

-   `onUpdate` prop's first argument, has a new attribute `config`. It gives you ability to check current React SDK config during an update.

-   useFlagship hook now returns a new node `getModificationInfo`.

### Breaking changes ⚠️

-   When sending a hit "Item", the attribute `ic`(="item code") is now **required** (was optional before). If you do not specify it, the hit won't be send and an error log will be display.

-   Safe mode is now disable by default because we're working on some improvements. You can still give it a try by enabling it with:

```
<FlagshipProvider
    enableSafeMode={true}
/>
```
