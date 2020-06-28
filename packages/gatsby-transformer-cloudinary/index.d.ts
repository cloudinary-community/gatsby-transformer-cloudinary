import { NodePluginArgs, Store, GatsbyCache, Reporter } from 'gatsby';

export function createRemoteImageNode(
  args: CreateRemoteImageNodeArgs,
): Promise<CloudinaryAssetNode>;

export interface CreateRemoteImageNodeArgs {
  url: string;
  // store: Store;
  // cache: GatsbyCache;
  createNode: NodePluginArgs['actions']['createNode'];
  createNodeId: NodePluginArgs['createNodeId'];
  // auth?: {
  //   htaccess_user: string;
  //   htaccess_pass: string;
  // };
  // httpHeaders?: object;
  // ext?: string;
  // name?: string;
  // reporter: Reporter;


  //these were added
  parentNodeId?: string;
  relationshipName?: string;
  parentNode?: any;
  createContentDigest: NodePluginArgs['createContentDigest'];

}

export type CloudinaryAssetNode = any;
