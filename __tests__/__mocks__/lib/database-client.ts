// Mock for database-client.ts

export const db = {
  getPolls: jest.fn(),
  getPoll: jest.fn(),
  createPoll: jest.fn(),
  updatePoll: jest.fn(),
  deletePoll: jest.fn(),
  vote: jest.fn(),
  getUserVotes: jest.fn(),
  getPollResults: jest.fn(),
  getTotalVotes: jest.fn(),
};

// Add a dummy test to avoid Jest warning
describe('Database client mock', () => {
  it('should exist', () => {
    expect(db).toBeDefined();
    expect(db.getPolls).toBeDefined();
  });
});