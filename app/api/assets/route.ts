// app/api/assets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/mongodb';

// Define the response type locally if import fails
interface AssetBatchResponse {
  assets: any[];
  batch_id: string;
  total_assets: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  cache_key: string;
}

// app/api/assets/route.ts
export async function GET(request: NextRequest) {
  console.log('🔍 Assets API route called');
  
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('page_size') || '30'), 100);
    
    console.log(`📊 Query params - type: ${type}, page: ${page}, pageSize: ${pageSize}`);

    const db = await getDatabase();
    console.log('✅ Database connected successfully');
    
    const collection = db.collection('assets');

    const query: any = {};
    if (type) {
      query.type = type;
    }

    const skip = (page - 1) * pageSize;

    console.log('🔍 MongoDB query:', JSON.stringify(query));

    const totalAssets = await collection.countDocuments(query);
    console.log(`📊 Total assets found: ${totalAssets}`);

    if (totalAssets === 0) {
      console.log('⚠️ No assets found in collection');
      return NextResponse.json({
        assets: [],
        batch_id: `batch_${page}_${Date.now()}`,
        total_assets: 0,
        total_pages: 0,
        current_page: page,
        page_size: pageSize,
        cache_key: `${type || 'all'}_${page}_${pageSize}`
      });
    }

    // ✅ Use ONLY inclusion projection (remove exclusions)
    const assets = await collection
      .find(query, {
        projection: {
          _id: 1,
          name: 1,
          type: 1,
          subcategory: 1,
          gen: 1,
          description: 1,
          image_url: 1,
          contentType: 1,
          created_at: 1,
          updated_at: 1,
          metadata: 1
          // ❌ Don't include exclusions here
          // image_data: 0,
          // description_vector: 0,
          // image_embedding: 0
        }
      })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    console.log(`✅ Found ${assets.length} assets for current page`);

    const totalPages = Math.ceil(totalAssets / pageSize);

    const processedAssets = assets.map((asset: any) => ({
      ...asset,
      _id: asset._id.toString(),
    }));

    const response: AssetBatchResponse = {
      assets: processedAssets,
      batch_id: `batch_${page}_${Date.now()}`,
      total_assets: totalAssets,
      total_pages: totalPages,
      current_page: page,
      page_size: pageSize,
      cache_key: `${type || 'all'}_${page}_${pageSize}`
    };

    console.log(`📦 Returning response with ${response.assets.length} assets`);
    return NextResponse.json(response);

  } catch (error) {
    console.error('💥 Error in assets route:', error);
    
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    };
    
    console.error('📋 Error details:', errorDetails);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch assets', 
        details: errorDetails.message,
        timestamp: errorDetails.timestamp
      },
      { status: 500 }
    );
  }
}