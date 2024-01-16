import React, { useRef } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getPost } from "@/lib/posts";
import { Prose } from "@nikolovlazar/chakra-ui-prose";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Youtube from "@tiptap/extension-youtube";
import Link from "@tiptap/extension-link";
import { Text, Box } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  const { params } = context;
  const { postId } = params;

  try {
    const data = await getPost(postId, session.user.jwt);
    return {
      props: {
        post: data.data.attributes,
        postId: postId,
      },
    };
  } catch (error) {
    console.error("Error fetching article:", error);
    return {
      notFound: true,
    };
  }
}

export default function PreviewArticlePage({ post }) {
  const toast = useToast();
  const toastIdRef = useRef();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        // Use a placeholder:
        placeholder: "Write something …",
      }),
      Image.configure({
        inline: true,
      }),
      Youtube.configure({
        width: 480,
        height: 320,
      }),
      Link.configure({
        protocols: ["http", "https", "mailto", "tel"],
      }),
    ],
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
        <Text>Written by {post.author.data.attributes.name}</Text>
        <Prose>
          <EditorContent editor={editor} />
        </Prose>
      </Box>
    </>
  );
}
