import { catalogEntities } from './catalog-entities';

describe('catalogEntities', () => {
  it('should list every catalog (schema-shared) ORM entity', () => {
    expect(catalogEntities).toHaveLength(5);
    expect(catalogEntities.every((entity) => typeof entity === 'function')).toBe(true);
  });
});
