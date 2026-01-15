import { IndexedEntity } from "./core-utils";
import type { ShareState, ShareMetadata, ShareFile } from "@shared/types";
export class ShareEntity extends IndexedEntity<ShareState> {
  static readonly entityName = "share";
  static readonly indexName = "shares";
  static readonly initialState: ShareState = {
    id: "",
    title: "Untitled Sketch",
    createdAt: 0,
    fileCount: 0,
    totalSize: 0,
    isWebsite: false,
    files: {}
  };
  async uploadFiles(files: ShareFile[]): Promise<void> {
    await this.mutate(state => {
      const fileMap = { ...state.files };
      let size = 0;
      files.forEach(f => {
        fileMap[f.path] = f;
        size += f.size;
      });
      return {
        ...state,
        files: fileMap,
        fileCount: Object.keys(fileMap).length,
        totalSize: state.totalSize + size
      };
    });
  }
  async getFile(path: string): Promise<ShareFile | null> {
    const state = await this.getState();
    return state.files[path] || null;
  }
}
// Keeping boilerplate entities for safety but ShareEntity is primary
import type { User, Chat, ChatMessage } from "@shared/types";
export class UserEntity extends IndexedEntity<User> {
  static readonly entityName = "user";
  static readonly indexName = "users";
  static readonly initialState: User = { id: "", name: "" };
}