import { NodeViewWrapper } from '@tiptap/react';
import { TwitterTweetEmbed } from 'react-twitter-embed';

export default function TwitterEmbed(props) {
  return (
    <NodeViewWrapper className='twitter-embed'>
      <TwitterTweetEmbed tweetId={props.node.attrs.tweetId} />
    </NodeViewWrapper>
  );
}
