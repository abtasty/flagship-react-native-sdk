import {FsVisitorState} from './types';

const initialState: FsVisitorState = {
  envId: null,
  id: null,
  isAuthenticated: null,
  context: null,
  isAllModificationsFetched: null,
  bucket: {
    data: null,
    computedData: null,
    envId: null,
    visitorId: null,
    visitorContext: null,
  },
  fetchedModifications: null,
  modificationsInternalStatus: null,
};

export default initialState;
