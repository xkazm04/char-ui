import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';

const DB_NAME = process.env.DB_NAME || 'char';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log(`🔍 GET generation by ID: ${id}`);
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid generation ID format' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('generations');

    const generation = await collection.findOne(
      { _id: new ObjectId(id) },
      {
        projection: {
          description_vector: 0,
          embedding: 0
        }
      }
    );

    if (!generation) {
      return NextResponse.json(
        { error: 'Generation not found' },
        { status: 404 }
      );
    }

    const processedGeneration = {
      ...generation,
      _id: generation._id.toString(),
      character_id: generation.character_id?.toString() || generation.character_id
    };

    return NextResponse.json(processedGeneration);

  } catch (error) {
    console.error('Error fetching generation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch generation', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('🗑️ DELETE generation API route called');
  
  try {
    const { id } = await params;
    
    console.log(`🗑️ Attempting to delete generation: ${id}`);
    console.log(`🗑️ Request URL: ${request.url}`);
    console.log(`🗑️ Request method: ${request.method}`);
    
    if (!id) {
      console.log('❌ No ID provided in params');
      return NextResponse.json(
        { error: 'Generation ID is required' },
        { status: 400 }
      );
    }
    
    if (!ObjectId.isValid(id)) {
      console.log(`❌ Invalid ObjectId format: ${id}`);
      return NextResponse.json(
        { error: 'Invalid generation ID format' },
        { status: 400 }
      );
    }

    // ✅ **DUAL STRATEGY**: Try both MongoDB and backend deletion
    let mongoSuccess = false;
    let backendSuccess = false;
    let generation = null;
    
    // Try MongoDB deletion first
    try {
      console.log('🗄️ Attempting MongoDB deletion...');
      
      const client = await clientPromise;
      const db = client.db(DB_NAME);
      const collection = db.collection('generation');

      // First, get the generation to extract leo_id for external cleanup
      generation = await collection.findOne({ _id: new ObjectId(id) });
      
      if (generation) {
        console.log(`✅ Found generation in MongoDB: ${id}, leo_id: ${generation.leo_id}`);
        
        // Delete from MongoDB
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount > 0) {
          console.log(`✅ Successfully deleted from MongoDB: ${id}`);
          mongoSuccess = true;
        } else {
          console.log(`⚠️ MongoDB delete operation returned 0 deleted count`);
        }
      } else {
        console.log(`⚠️ Generation not found in MongoDB: ${id}`);
      }
    } catch (mongoError) {
      console.error('❌ MongoDB deletion failed:', mongoError);
    }

    // Try backend deletion as well/fallback
    try {
      console.log('🌐 Attempting backend deletion...');
      
      const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';
      const backendResponse = await fetch(`${backendUrl}/gen/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000)
      });

      if (backendResponse.ok) {
        console.log(`✅ Backend deletion successful: ${id}`);
        backendSuccess = true;
      } else {
        console.log(`⚠️ Backend deletion failed with status: ${backendResponse.status}`);
        const errorText = await backendResponse.text().catch(() => 'Unknown');
        console.log(`⚠️ Backend error details: ${errorText}`);
      }
    } catch (backendError) {
      console.error('❌ Backend deletion failed:', backendError);
    }

    // Check if either deletion succeeded
    if (!mongoSuccess && !backendSuccess) {
      console.log('❌ Both MongoDB and backend deletion failed');
      return NextResponse.json(
        { error: 'Failed to delete generation from both MongoDB and backend' },
        { status: 500 }
      );
    }

    // Handle external cleanup (Leonardo API) if we have leo_id
    if (generation?.leo_id) {
      try {
        console.log(`🧹 Attempting Leonardo cleanup for leo_id: ${generation.leo_id}`);
        
        const backendUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';
        const cleanupResponse = await fetch(`${backendUrl}/internal/cleanup-leonardo/${generation.leo_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(5000)
        });

        if (cleanupResponse.ok) {
          console.log(`✅ Leonardo cleanup successful for: ${generation.leo_id}`);
        } else {
          console.warn(`⚠️ Leonardo cleanup failed with status ${cleanupResponse.status} for: ${generation.leo_id}`);
        }
      } catch (cleanupError) {
        console.warn('⚠️ Leonardo cleanup error:', cleanupError);
        // Don't fail the main delete operation for cleanup errors
      }
    }

    const successMessage = mongoSuccess && backendSuccess ? 
      'both MongoDB and backend' : 
      mongoSuccess ? 'MongoDB' : 'backend';
    
    console.log(`🎉 Generation deletion completed successfully from ${successMessage}: ${id}`);
    
    // Return success response
    return new NextResponse(null, { 
      status: 204,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('💥 Unexpected error in DELETE route:', error);
    
    // Enhanced error logging
    console.error('💥 Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      url: request.url,
      method: request.method,
      timestamp: new Date().toISOString()
    });
    
    return NextResponse.json(
      { 
        error: 'Failed to delete generation', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}