import type { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import type { CreateFriendInput, UpdateFriendInput } from '../types/models.types.js';

// List all friends
export const listFriends = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('friends')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to fetch friends',
        details: error.message 
      });
    }

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Get a single friend by ID
export const getFriend = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('friends')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Friend not found'
        });
      }
      return res.status(400).json({
        status: 'error',
        message: 'Failed to fetch friend',
        details: error.message 
      });
    }

    res.status(200).json({
      status: 'success',
      data
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Create a new friend
export const createFriend = async (req: Request, res: Response) => {
  try {
    const friendData: CreateFriendInput = req.body;

    const { data: friend, error } = await supabaseAdmin
      .from('friends')
      .insert(friendData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to create friend',
        details: error.message 
      });
    }

    res.status(201).json({
      status: 'success',
      message: 'Friend created successfully',
      data: friend
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Update a friend
export const updateFriend = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateFriendInput = req.body;

    const { data: friend, error } = await supabaseAdmin
      .from('friends')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          status: 'error',
          message: 'Friend not found'
        });
      }
      return res.status(400).json({
        status: 'error',
        message: 'Failed to update friend',
        details: error.message 
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Friend updated successfully',
      data: friend
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};

// Delete a friend
export const deleteFriend = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('friends')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Failed to delete friend',
        details: error.message 
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Friend deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
};