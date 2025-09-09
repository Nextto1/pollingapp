import { db } from '@/lib/database-client';
import { createClient } from '@/lib/supabase';

// Mock the supabase client and database client
jest.mock('@/lib/supabase', () => ({
  createClient: jest.fn(),
}));

jest.mock('@/lib/database-client');

describe('Poll Actions', () => {
  // Mock data
  const mockPoll = {
    id: '123',
    title: 'Test Poll',
    description: 'Test Description',
    status: 'active',
    vote_type: 'single',
    allow_multiple_votes: false,
    max_votes_per_user: 1,
    created_by: 'user-123',
    created_at: new Date().toISOString(),
  };

  const mockPollOptions = [
    { id: 'opt-1', poll_id: '123', text: 'Option 1', order_index: 0 },
    { id: 'opt-2', poll_id: '123', text: 'Option 2', order_index: 1 },
  ];

  // Mock Supabase responses
  const mockSupabase = {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    range: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    auth: {
      getUser: jest.fn(),
    },
  };
  
  // Fix for chained eq calls
  mockSupabase.eq.mockImplementation(() => mockSupabase);

  beforeEach(() => {
    jest.clearAllMocks();
    (createClient as jest.Mock).mockReturnValue(mockSupabase);
    
    // Fix for all chained method calls
    mockSupabase.from.mockImplementation(() => mockSupabase);
    mockSupabase.select.mockImplementation(() => mockSupabase);
    mockSupabase.insert.mockImplementation(() => mockSupabase);
    mockSupabase.update.mockImplementation(() => mockSupabase);
    mockSupabase.delete.mockImplementation(() => mockSupabase);
    mockSupabase.eq.mockImplementation(() => mockSupabase);
    mockSupabase.or.mockImplementation(() => mockSupabase);
    mockSupabase.order.mockImplementation(() => mockSupabase);
    mockSupabase.range.mockImplementation(() => mockSupabase);
    mockSupabase.limit.mockImplementation(() => mockSupabase);
    mockSupabase.single.mockImplementation(() => mockSupabase);
  });

  describe('getPolls', () => {
    it('should fetch polls with default parameters', async () => {
      // Setup
      mockSupabase.select.mockReturnThis();
      mockSupabase.order.mockReturnThis();
      mockSupabase.from.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.or.mockReturnThis();
      mockSupabase.limit.mockReturnThis();
      mockSupabase.range.mockReturnThis();
      const mockResponse = { data: [mockPoll], error: null };
      jest.spyOn(mockSupabase, 'select').mockImplementation(() => mockSupabase);
      jest.spyOn(mockSupabase, 'order').mockImplementation(() => Promise.resolve(mockResponse));

      // Execute
      const result = await db.getPolls();

      // Verify
      expect(mockSupabase.from).toHaveBeenCalledWith('polls');
      expect(mockSupabase.select).toHaveBeenCalled();
      expect(mockSupabase.order).toHaveBeenCalledWith('created_at', { ascending: false });
      expect(result).toEqual([mockPoll]);
    });

    it('should apply filters when provided', async () => {
      // Setup
      const filters = {
        status: 'active' as const,
        search: 'test',
        limit: 5,
        offset: 0,
      };
      
      mockSupabase.select.mockReturnThis();
      mockSupabase.order.mockReturnThis();
      mockSupabase.from.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.or.mockReturnThis();
      mockSupabase.limit.mockReturnThis();
      mockSupabase.range.mockReturnThis();
      const mockResponse = { data: [mockPoll], error: null };
      jest.spyOn(mockSupabase, 'select').mockImplementation(() => mockSupabase);
      jest.spyOn(mockSupabase, 'order').mockImplementation(() => Promise.resolve(mockResponse));

      // Execute
      const result = await db.getPolls(filters);

      // Verify
      expect(mockSupabase.from).toHaveBeenCalledWith('polls');
      expect(mockSupabase.eq).toHaveBeenCalledWith('status', 'active');
      expect(mockSupabase.or).toHaveBeenCalledWith('title.ilike.%test%,description.ilike.%test%');
      expect(mockSupabase.limit).toHaveBeenCalledWith(5);
      expect(mockSupabase.range).toHaveBeenCalledWith(0, 4);
      expect(result).toEqual([mockPoll]);
    });
  });

  describe('getPoll', () => {
    it('should fetch a single poll by id', async () => {
      // Setup
      mockSupabase.select.mockReturnThis();
      mockSupabase.from.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.single.mockReturnThis();
      const mockResponse = { data: mockPoll, error: null };
      jest.spyOn(mockSupabase, 'single').mockImplementation(() => Promise.resolve(mockResponse));

      // Execute
      const result = await db.getPoll('123');

      // Verify
      expect(mockSupabase.from).toHaveBeenCalledWith('polls');
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '123');
      expect(mockSupabase.single).toHaveBeenCalled();
      expect(result).toEqual(mockPoll);
    });
  });

  describe('createPoll', () => {
    it('should create a new poll with options', async () => {
      // Setup
      const pollData = {
        title: 'New Poll',
        description: 'New Description',
        status: 'active' as const,
        vote_type: 'single' as const,
        allow_multiple_votes: false,
        max_votes_per_user: 1,
      };
      
      const options = ['Option 1', 'Option 2'];
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.insert.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.single.mockReturnThis();
      
      const mockPollResponse = { data: mockPoll, error: null };
      const mockOptionsResponse = { data: null, error: null };
      
      jest.spyOn(mockSupabase, 'single').mockImplementation(() => Promise.resolve(mockPollResponse));
      jest.spyOn(mockSupabase, 'insert').mockImplementation(() => {
        // For the second call (options insert)
        if (mockSupabase.insert.mock.calls.length === 2) {
          return Promise.resolve(mockOptionsResponse);
        }
        return mockSupabase;
      });

      // Execute
      const result = await db.createPoll(pollData, options);

      // Verify
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('polls');
      expect(mockSupabase.insert).toHaveBeenCalledWith({
        ...pollData,
        created_by: 'user-123',
      });
      expect(mockSupabase.from).toHaveBeenCalledWith('poll_options');
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        { poll_id: '123', text: 'Option 1', order_index: 0 },
        { poll_id: '123', text: 'Option 2', order_index: 1 },
      ]);
      expect(result).toEqual(mockPoll);
    });
  });

  describe('updatePoll', () => {
    it('should update an existing poll', async () => {
      // Setup
      const updates = {
        title: 'Updated Title',
        description: 'Updated Description',
      };
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.update.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.single.mockReturnThis();
      
      const mockResponse = { 
        data: { ...mockPoll, ...updates },
        error: null 
      };
      
      jest.spyOn(mockSupabase, 'single').mockImplementation(() => Promise.resolve(mockResponse));

      // Execute
      const result = await db.updatePoll('123', updates);

      // Verify
      expect(mockSupabase.from).toHaveBeenCalledWith('polls');
      expect(mockSupabase.update).toHaveBeenCalledWith(updates);
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '123');
      expect(result).toEqual({ ...mockPoll, ...updates });
    });
  });

  describe('deletePoll', () => {
    it('should delete a poll', async () => {
      // Setup
      mockSupabase.from.mockReturnThis();
      mockSupabase.delete.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      
      const mockResponse = { error: null };
      jest.spyOn(mockSupabase, 'eq').mockImplementation(() => Promise.resolve(mockResponse));

      // Execute
      await db.deletePoll('123');

      // Verify
      expect(mockSupabase.from).toHaveBeenCalledWith('polls');
      expect(mockSupabase.delete).toHaveBeenCalled();
      expect(mockSupabase.eq).toHaveBeenCalledWith('id', '123');
    });
  });

  describe('vote', () => {
    it('should create votes for poll options', async () => {
      // Setup
      const pollId = '123';
      const optionIds = ['opt-1', 'opt-2'];
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.insert.mockReturnThis();
      
      const mockResponse = { data: null, error: null };
      jest.spyOn(mockSupabase, 'insert').mockImplementation(() => Promise.resolve(mockResponse));

      // Execute
      await db.vote(pollId, optionIds);

      // Verify
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('votes');
      expect(mockSupabase.insert).toHaveBeenCalledWith([
        { poll_id: '123', option_id: 'opt-1', user_id: 'user-123' },
        { poll_id: '123', option_id: 'opt-2', user_id: 'user-123' },
      ]);
    });
  });

  describe('getUserVotes', () => {
    it('should get user votes for a poll', async () => {
      // Setup
      const pollId = '123';
      
      mockSupabase.auth.getUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null,
      });
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      
      const mockResponse = { 
        data: [
          { option_id: 'opt-1' },
          { option_id: 'opt-2' },
        ],
        error: null 
      };
      
      jest.spyOn(mockSupabase, 'eq').mockImplementation(() => Promise.resolve(mockResponse));

      // Execute
      const result = await db.getUserVotes(pollId);

      // Verify
      expect(mockSupabase.auth.getUser).toHaveBeenCalled();
      expect(mockSupabase.from).toHaveBeenCalledWith('votes');
      expect(mockSupabase.select).toHaveBeenCalledWith('option_id');
      expect(mockSupabase.eq).toHaveBeenCalledWith('poll_id', '123');
      expect(mockSupabase.eq).toHaveBeenCalledWith('user_id', 'user-123');
      expect(result).toEqual(['opt-1', 'opt-2']);
    });
  });

  describe('getPollResults', () => {
    it('should get poll results', async () => {
      // Setup
      const pollId = '123';
      const mockResults = [
        { poll_id: '123', option_id: 'opt-1', vote_count: 5, percentage: 50 },
        { poll_id: '123', option_id: 'opt-2', vote_count: 5, percentage: 50 },
      ];
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      mockSupabase.order.mockReturnThis();
      
      const mockResponse = { data: mockResults, error: null };
      jest.spyOn(mockSupabase, 'order').mockImplementation(() => Promise.resolve(mockResponse));

      // Execute
      const result = await db.getPollResults(pollId);

      // Verify
      expect(mockSupabase.from).toHaveBeenCalledWith('poll_results');
      expect(mockSupabase.select).toHaveBeenCalledWith('*');
      expect(mockSupabase.eq).toHaveBeenCalledWith('poll_id', '123');
      expect(mockSupabase.order).toHaveBeenCalledWith('order_index');
      expect(result).toEqual(mockResults);
    });
  });

  describe('getTotalVotes', () => {
    it('should get total votes for a poll', async () => {
      // Setup
      const pollId = '123';
      
      mockSupabase.from.mockReturnThis();
      mockSupabase.select.mockReturnThis();
      mockSupabase.eq.mockReturnThis();
      
      const mockResponse = { count: 10, error: null };
      jest.spyOn(mockSupabase, 'eq').mockImplementation(() => Promise.resolve(mockResponse));

      // Execute
      const result = await db.getTotalVotes(pollId);

      // Verify
      expect(mockSupabase.from).toHaveBeenCalledWith('votes');
      expect(mockSupabase.select).toHaveBeenCalledWith('*', { count: 'exact', head: true });
      expect(mockSupabase.eq).toHaveBeenCalledWith('poll_id', '123');
      expect(result).toEqual(10);
    });
  });
});