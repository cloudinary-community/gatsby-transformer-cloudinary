import { NodePluginArgs, Store, GatsbyCache, Reporter } from 'gatsby';

export function createRemoteImageNode(
  args: CreateRemoteImageNodeArgs,
): Promise<CloudinaryAssetNode>;

export interface CreateRemoteImageNodeArgs {
  url: string;
  parentNode: any;
  relationshipName: string;
  createContentDigest: NodePluginArgs['createContentDigest'];
  createNode: NodePluginArgs['actions']['createNode'];
  createNodeId: NodePluginArgs['createNodeId'];
  reporter: Reporter;
}

export type CloudinaryAssetNode = any;
