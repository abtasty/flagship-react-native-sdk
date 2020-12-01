import { FlagshipCommon } from '@flagship.io/js-sdk-logs';

const XidLength = 20;
const XidPattern = '[0-9a-v]{20}';

export function generateFlagshipId() {
    return FlagshipCommon.createVisitorId();
}

export function checkValidityPatternForEnvId(envId) {
    /// Check pattren for envId (xid)
    return envId.length === XidLength && envId.match(XidPattern);
}
