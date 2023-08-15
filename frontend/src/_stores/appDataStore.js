import { appVersionService } from '@/_services';
import { create, zustandDevTools } from './utils';

const initialState = {
  editingVersion: null,
  currentUser: null,
  apps: [],
  appId: null,
  appName: null,
  slug: null,
  isPublic: null,
  isMaintenanceOn: null,
  organizationId: null,
  currentVersionId: null,
  userId: null,
  app: {},
  components: [],
  pages: [],
  layouts: [],
  events: [],
  eventHandlers: [],
  appDefinitionDiff: null,
  appDiffOptions: {},
};

export const useAppDataStore = create(
  zustandDevTools(
    (set) => ({
      ...initialState,
      actions: {
        updateEditingVersion: (version) => set(() => ({ editingVersion: version })),
        updateApps: (apps) => set(() => ({ apps: apps })),
        updateState: (state) => set((prev) => ({ ...prev, ...state })),
        updateAppDefinitionDiff: (appDefinitionDiff) => set(() => ({ appDefinitionDiff: appDefinitionDiff })),
        updateAppVersion: async (appId, versionId, pageId, appDefinitionDiff, isUserSwitchedVersion = false) => {
          return await appVersionService.autoSaveApp(
            appId,
            versionId,
            appDefinitionDiff.updateDiff,
            appDefinitionDiff.type,
            pageId,
            appDefinitionDiff.operation,
            isUserSwitchedVersion
          );
        },
      },
    }),
    { name: 'App Data Store' }
  )
);

export const useEditingVersion = () => useAppDataStore((state) => state.editingVersion);
export const useUpdateEditingVersion = () => useAppDataStore((state) => state.actions);
export const useCurrentUser = () => useAppDataStore((state) => state.currentUser);
export const useAppInfo = () => useAppDataStore((state) => state);
export const useAppDataActions = () => useAppDataStore((state) => state.actions);
