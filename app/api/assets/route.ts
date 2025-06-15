import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/app/lib/mongodb';
import { AssetBatchResponse } from '@/app/types/asset';

const DB_NAME = process.env.DB_NAME || 'char';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(searchParams.get('page_size') || '30'), 100);
    const imageQuality = parseInt(searchParams.get('image_quality') || '25');
    const maxImageWidth = searchParams.get('max_image_width') ? 
      parseInt(searchParams.get('max_image_width')!) : null;

    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const collection = db.collection('assets');

    const query: any = {};
    if (type) {
      query.type = type;
    }

    const skip = (page - 1) * pageSize;

    // Use aggregation pipeline for better performance
    const pipeline = [
      { $match: query },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: pageSize },
            {
              $project: {
                _id: 1,
                name: 1,
                type: 1,
                subcategory: 1,
                gen: 1,
                description: 1,
                image_url: 1,
                image_data: 1,
                contentType: 1,
                created_at: 1,
                updated_at: 1
              }
            }
          ],
          count: [
            { $count: "total" }
          ]
        }
      }
    ];

    const [result] = await collection.aggregate(pipeline).toArray();
    
    const assets = result.data || [];
    const totalAssets = result.count[0]?.total || 0;
    const totalPages = Math.ceil(totalAssets / pageSize);

    // Process images efficiently - simplified to avoid Sharp dependency issues
    const processedAssets = assets.map((asset: any) => {
      try {
        const processedAsset = { ...asset };
        
        // Handle image data - convert Buffer to base64 without Sharp processing
        if (asset.image_data) {
          // Check if it's a Buffer or already base64
          if (Buffer.isBuffer(asset.image_data)) {
            processedAsset.image_data_base64 = asset.image_data.toString('base64');
            processedAsset.image_content_type = asset.contentType || 'image/png';
          } else if (typeof asset.image_data === 'string') {
            // Already base64 or string
            processedAsset.image_data_base64 = asset.image_data;
            processedAsset.image_content_type = asset.contentType || 'image/png';
          }
        }
        
        // Remove unnecessary fields
        delete processedAsset.image_data;
        delete processedAsset.description_vector;
        delete processedAsset.image_embedding;
        
        return processedAsset;
      } catch (error) {
        console.error(`Error processing asset ${asset._id}:`, error);
        // Return asset without image processing rather than null
        const { image_data, description_vector, image_embedding, ...cleanAsset } = asset;
        return cleanAsset;
      }
    });

    const response: AssetBatchResponse = {
      assets: processedAssets,
      batch_id: `batch_${page}_${Date.now()}`,
      total_assets: totalAssets,
      total_pages: totalPages,
      current_page: page,
      page_size: pageSize,
      cache_key: `${type || 'all'}_${page}_${pageSize}`
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch assets', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}