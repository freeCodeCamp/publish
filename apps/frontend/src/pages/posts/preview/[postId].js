import React, { useRef } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getPost } from "@/lib/posts";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { EditorContent, useEditor } from "@tiptap/react";
import { Text, Box, Image, useToast } from "@chakra-ui/react";

import { extensions } from "@/lib/editor-config";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const apiBase = process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL;

  const { params } = context;
  const { postId } = params;

  try {
    const data = await getPost(postId, session.user.jwt);
    return {
      props: {
        post: data.data.attributes,
        postId: postId,
        baseUrl: apiBase,
      },
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return {
      notFound: true,
    };
  }
}

export default function PreviewArticlePage({ post, baseUrl }) {
  const toast = useToast();
  const toastIdRef = useRef();

  const editor = useEditor({
    extensions,
    content: post?.body,
    editable: false,
    editorProps: {
      attributes: {
        class: "preview",
      },
    },
    onCreate: () => {
      // Prevent from creating a new toast every time the editor is created
      if (toastIdRef.current) {
        toast.close(toastIdRef.current);
      }
      toastIdRef.current = toast({
        title: `Preview Mode`,
        description: `This is just a preview of the formatting of the content for readability. The page may look different when published on the publication.`,
        isClosable: true,
        status: "info",
        position: "bottom-right",
        duration: null,
      });
    },
  });

  return (
    <>
      <Box m="0rem auto" w="100%" maxW="1060px" pt="5rem" px="4vw">
        <Text fontSize="xxx-large" fontWeight="bold">
          {post?.title}
        </Text>
        <Text fontSize="md" color="gray.500" mb="2rem">
          Written by {post.author.data.attributes.name}
        </Text>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          w="100%"
          h="auto"
          minW="100%"
          maxH="800px"
          objectFit="cover"
          overflow="hidden"
          borderRadius="md"
          bgColor="gray.100"
          mb="2rem"
        >
          {post.feature_image.data ? (
            <Image
              src={new URL(post.feature_image.data.attributes.url, baseUrl)}
              alt="Post Image"
              w="100%"
              h="auto"
              maxH="500px"
              objectFit="cover"
              data-testid="feature-image-preview"
            />
          ) : (
            <Box>
              <Text color="gray.400" textAlign="center">
                No image provided
              </Text>
            </Box>
          )}
        </Box>
        <Prose>
          <EditorContent editor={editor} />
        </Prose>
      </Box>
    </>
  );
}
