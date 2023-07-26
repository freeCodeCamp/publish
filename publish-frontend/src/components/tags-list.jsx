export default function TagsList({ allTagsData }) {
  return (
    <>
      <ul>
        {allTagsData.data.map(tag => {
          return (
            <li key={tag.id} className='mb-5'>
              <strong>{tag.attributes.name}</strong>
            </li>
          );
        })}
      </ul>
    </>
  );
}
