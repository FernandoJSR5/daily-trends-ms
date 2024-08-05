import { Feed } from '../../../src/domain/entities/Feed';

describe('Feed Class', () => {
  it('should create a Feed object with correct properties', () => {
    const feed = new Feed(
      'Test Title',
      'Test Description',
      'Test Author',
      'Test Journal',
      'http://testlink.com'
    );

    expect(feed.title).toBe('Test Title');
    expect(feed.description).toBe('Test Description');
    expect(feed.author).toBe('Test Author');
    expect(feed.journal).toBe('Test Journal');
    expect(feed.link).toBe('http://testlink.com');
  });
});
