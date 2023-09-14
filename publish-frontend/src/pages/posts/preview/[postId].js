import React from 'react';
import { getServerSession } from 'next-auth/next';
import NextLink from 'next/link';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getPost } from '@/lib/posts';
import { Prose } from '@nikolovlazar/chakra-ui-prose';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Link from '@tiptap/extension-link';
import { Text, Button, Box, Alert, AlertIcon } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const { params } = context;
  const { postId } = params;
  console.log('postId: ', postId);
  try {
    const data = await getPost(postId, session.user.jwt);
    return {
      props: {
        post: data.data.attributes,
        postId: postId
      }
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      notFound: true
    };
  }
}

export default function PreviewArticlePage({ post, postId }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false
        }
      }),
      Placeholder.configure({
        // Use a placeholder:
        placeholder: 'Write something …'
      }),
      Image.configure({
        inline: true
      }),
      Youtube.configure({
        width: 480,
        height: 320
      }),
      Link.configure({
        protocols: ['http', 'https', 'mailto', 'tel']
      })
    ],
    content: post?.body,
    editable: false,
    editorProps: {
      attributes: {
        class: 'prose'
      }
    }
  });

  return (
    <>
      <Alert status='warning'>
        <AlertIcon />
        This is just a preview of the formatting of the content for readability.
        The page may look different when published on the publication.
      </Alert>
      <Box display='flex' justifyContent='start' m='1rem 0 0 5rem'>
        <Button
          variant='link'
          as={NextLink}
          href={`/posts/${postId}`}
          leftIcon={<FontAwesomeIcon size='lg' icon={faChevronLeft} />}
        >
          <Text fontSize='2xl'>Post</Text>
        </Button>
      </Box>
      <Box m='0 auto' w='100vh'>
        <Text fontSize='xxx-large' fontWeight='bold'>
          {post?.title}
        </Text>
        <Text>Written by {post.author.data.attributes.username}</Text>
        <Prose>
          <EditorContent editor={editor} />
        </Prose>
      </Box>
    </>
  );
}
