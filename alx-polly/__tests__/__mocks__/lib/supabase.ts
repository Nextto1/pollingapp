// Mock for supabase client
export const createClient = jest.fn();

// Add a dummy test to avoid Jest warning
describe('Supabase mock', () => {
  it('should exist', () => {
    expect(createClient).toBeDefined();
  });
});