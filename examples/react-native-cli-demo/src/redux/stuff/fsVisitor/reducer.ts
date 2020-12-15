import {FS_VISITOR_UPDATE} from './../../glossary';
import {FsVisitorState, FsVisitorAction} from './types';
import initialState from './initialState';

const FsVisitorReducer = (
  state: FsVisitorState = initialState,
  action: FsVisitorAction,
): FsVisitorState => {
  let bucket;

  if (!action.payload) {
    return state;
  }

  switch (action.type) {
    case FS_VISITOR_UPDATE:
      bucket = action.payload.bucket || initialState.bucket;
      return {
        envId: action.payload.envId,
        id: action.payload.id,
        anonymousId: action.payload.anonymousId,
        context: action.payload.context,
        isAllModificationsFetched: action.payload.isAllModificationsFetched,
        bucket: {
          data: bucket.data,
          computedData: bucket.computedData,
          envId: bucket.envId,
          visitorId: bucket.visitorId,
          visitorContext: bucket.visitorContext,
        },
        fetchedModifications: action.payload.fetchedModifications,
        modificationsInternalStatus: action.payload.modificationsInternalStatus,
      };

    default:
      return state;
  }
};

export default FsVisitorReducer;
