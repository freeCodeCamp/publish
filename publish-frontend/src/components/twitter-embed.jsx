import { NodeViewWrapper } from '@tiptap/react';
import { TwitterTweetEmbed } from 'react-twitter-embed';

export default function TwitterEmbed(props) {
  const hasTweetId = props.node.attrs.tweetId !== null;

  const tweetIds = hasTweetId ? props.node.attrs.tweetId.split('/') : [];
  const lastTweetId =
    tweetIds.length > 0 ? tweetIds[tweetIds.length - 1] : '1709136269995872521';

  return (
    <NodeViewWrapper className='twitter-embed'>
      <TwitterTweetEmbed tweetId={lastTweetId} />
    </NodeViewWrapper>
  );
}
