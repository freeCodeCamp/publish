export default function TagsList({ allTagsData }) {
  return (
    <>
      <ul>
        {allTagsData.data.map(tag => {
          return (
            <li key={tag.id} style={{ marginBottom: '1.25rem' }}>
              <strong>{tag.attributes.name}</strong>
            </li>
          );
        })}
      </ul>
    </>
  );
}
