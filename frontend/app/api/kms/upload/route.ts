import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// 确保上传目录存在
const uploadDir = join(process.cwd(), 'uploads');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // 获取表单数据
    const businessId = formData.get('businessId') as string;
    const sceneId = formData.get('sceneId') as string;
    const tags = JSON.parse((formData.get('tags') as string) || '[]');
    const type = formData.get('type') as 'pdf' | 'manual';
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;

    // 验证必填字段
    if (!businessId || !sceneId || !type || !title) {
      return NextResponse.json({ error: '缺少必填字段' }, { status: 400 });
    }
    interface DocumentCreateData {
      businessId: string;
      sceneId: string;
      tags: string[];
      type: 'pdf' | 'manual';
      title: string;
      description: string | undefined;
      createdAt: string;
      updatedAt: string;
      filePath?: string; // PDF文件特有
      fileName?: string; // PDF文件特有
      fileSize?: number; // PDF文件特有
      content?: string; // 手动创建文档特有
    }

    const documentData: DocumentCreateData = {
      businessId,
      sceneId,
      tags,
      type,
      title,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 处理PDF文件上传
    if (type === 'pdf') {
      const file = formData.get('file') as File;

      if (!file) {
        return NextResponse.json({ error: 'PDF文件不能为空' }, { status: 400 });
      }

      // 验证文件类型
      if (file.type !== 'application/pdf') {
        return NextResponse.json({ error: '只能上传PDF格式文件' }, { status: 400 });
      }

      // 确保上传目录存在
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      // 生成唯一文件名
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const filePath = join(uploadDir, fileName);

      // 保存文件
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);

      documentData.filePath = `/uploads/${fileName}`;
      documentData.fileName = file.name;
      documentData.fileSize = file.size;
    }
    // 处理手动创建的文档
    else if (type === 'manual') {
      const content = formData.get('content') as string;

      if (!content) {
        return NextResponse.json({ error: '文档内容不能为空' }, { status: 400 });
      }

      documentData.content = content;
    }

    // 这里应该将documentData保存到数据库
    // 例如：await saveDocumentToDatabase(documentData);

    // 模拟数据库保存操作
    console.log('保存文档数据:', documentData);

    return NextResponse.json(
      {
        success: true,
        message: '文档上传成功',
        data: documentData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('上传文档失败:', error);
    return NextResponse.json({ error: '服务器内部错误' }, { status: 500 });
  }
}
