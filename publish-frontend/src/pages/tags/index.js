import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getTags } from '@/lib/tags';
import NavMenu from '@/components/nav-menu';
import TagsList from '@/components/tags-list';
import { Flex } from '@chakra-ui/react';

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  const allTagsData = await getTags(session.user.jwt);
  return {
    props: {
      allTagsData,
      user: session.user
    }
  };
}

export default function TagsIndex({ allTagsData, user }) {
  return (
    <Flex>
      <NavMenu user={user} />
      <main style={{ padding: '0.75rem' }}>
        <TagsList allTagsData={allTagsData} />
      </main>
    </Flex>
  );
}
