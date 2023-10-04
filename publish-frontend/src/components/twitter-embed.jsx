import { NodeViewWrapper } from '@tiptap/react';
import { TwitterTweetEmbed } from 'react-twitter-embed';

export default function TwitterEmbed(props) {
  const tweetIds = props.node.attrs.tweetId.split('/');
  const lastTweetId = tweetIds[tweetIds.length - 1];
  return (
    <NodeViewWrapper className='twitter-embed'>
      <TwitterTweetEmbed tweetId={lastTweetId} />
    </NodeViewWrapper>
  );
}
