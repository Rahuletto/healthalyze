import { NextResponse } from 'next/server';
import { insertPrediction } from '@/utils/sqlite';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const result = insertPrediction(data);
    
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (error) {
    console.error('Error saving prediction:', error);
    return NextResponse.json(
      { error: 'Failed to save prediction' },
      { status: 500 }
    );
  }
}