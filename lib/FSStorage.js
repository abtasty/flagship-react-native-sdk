import AsyncStorage from '@react-native-community/async-storage';

const VISITOR_CACHE_KEY = '@storage_fsVisitor';
const MODIFICATIONS_CACHE_KEY = '@storage_fsModifications';
const BUCKETING_CACHE_KEY = '@storage_fsBucketing';

// Get the stored modifications from device
export const getCacheFromPhone = async (log) => {
    return new Promise((resolve) => {
        Promise.all(
            [
                VISITOR_CACHE_KEY,
                MODIFICATIONS_CACHE_KEY,
                BUCKETING_CACHE_KEY
            ].map((cacheKey) => AsyncStorage.getItem(cacheKey))
        )
            .then((data) => {
                resolve(
                    data != null && typeof data === 'object'
                        ? ['visitor', 'modifications', 'bucketing'].reduce(
                              (reducer, key, index) => ({
                                  ...reducer,
                                  [key]:
                                      typeof data[index] === 'string'
                                          ? JSON.parse(data[index])
                                          : data[index]
                              }),
                              {}
                          )
                        : null
                );
            })
            .catch((e) => {
                log.debug('AsyncStorage GET - ' + e);
                resolve(null);
            });
    });
};

/// Write the updated modification in cache device
export const setModificationsCacheFromPhone = async (data, log) => {
    try {
        const fsModifications = (data && data.fsModifications) || [];
        const jsonValue = JSON.stringify(fsModifications);
        log.debug('Storing those modifications in cache:\n' + jsonValue);
        await AsyncStorage.setItem(MODIFICATIONS_CACHE_KEY, jsonValue);
    } catch (e) {
        log.debug('AsyncStorage SET failed with error:\n' + e);
    }
};

export const setVisitorReconciliationInCache = async (visitorData, log) => {
    try {
        const jsonValue = JSON.stringify({
            id: visitorData.id,
            anonymousId: visitorData.anonymousId
        });
        log.debug('Storing those modifications in cache:\n' + jsonValue);
        await AsyncStorage.setItem(VISITOR_CACHE_KEY, jsonValue);
    } catch (e) {
        log.debug('AsyncStorage SET failed with error:\n' + e);
    }
};

export const setBucketingCacheFromPhone = async (data, log) => {
    try {
        const bucketingData = (data && data.payload) || null;
        if (bucketingData !== null) {
            const jsonValue = JSON.stringify(bucketingData);
            log.debug('Storing bucketing in cache:\n' + jsonValue);
            await AsyncStorage.setItem(BUCKETING_CACHE_KEY, jsonValue);
        } else {
            log.debug('No bucketing data to save in cache!');
        }
    } catch (e) {
        log.debug('AsyncStorage SET failed with error:\n' + e);
    }
};
