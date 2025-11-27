import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('blog');
    
    const posts = await db
      .collection('posts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(posts);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const db = client.db('blog');
    
    // Create slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const post = {
      title: body.title,
      slug: slug,
      excerpt: body.excerpt,
      content: body.content,
      published: body.published || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('posts').insertOne(post);
    
    return NextResponse.json({ 
      success: true, 
      id: result.insertedId 
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}