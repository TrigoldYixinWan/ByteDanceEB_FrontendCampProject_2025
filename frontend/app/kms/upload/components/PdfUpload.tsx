'use client';

import { useState } from 'react';
import { Form, Input, Upload, Button, MessagePlugin } from 'tdesign-react';
import { UploadIcon } from 'tdesign-icons-react';
import type { UploadFile } from 'tdesign-react';

const { FormItem } = Form;

// 定义类型接口
interface PdfFormData {
  file: UploadFile | null;
  title: string;
  description: string;
}

interface PdfUploadProps {
  data?: PdfFormData;
  onChange: (field: keyof PdfFormData, value: string | UploadFile | null) => void;
}

export default function PdfUpload({
  data = { file: null, title: '', description: '' },
  onChange,
}: PdfUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);

  // 文件上传前验证
  const beforeUpload = (file: UploadFile) => {
    // TDesign的Upload组件传递的是UploadFile对象，需要获取其原始文件
    const rawFile = file.response || file;

    // 检查文件类型
    if (rawFile.type !== 'application/pdf') {
      MessagePlugin.error('只能上传PDF格式的文件');
      return false;
    }

    // 检查文件大小（10MB）
    if (rawFile.size > 10 * 1024 * 1024) {
      MessagePlugin.error('文件大小不能超过10MB');
      return false;
    }

    return true;
  };

  // 处理文件变化
  const handleUploadChange = (files: UploadFile[]) => {
    setUploadFiles(files);

    if (files.length > 0) {
      const file = files[0];
      // 如果文件名不为空且标题为空，则使用文件名作为标题
      if (file.name && !data.title) {
        // 移除文件扩展名
        const nameWithoutExt = file.name.replace(/\.pdf$/i, '');
        onChange('title', nameWithoutExt);
      }
      onChange('file', file);
    } else {
      onChange('file', null);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <Form layout="vertical">
        <FormItem label="上传PDF文件" rules={[{ required: true, message: '请选择PDF文件' }]}>
          <Upload
            action="" // 空字符串表示不上传到服务器，而是自己处理
            theme="file-flow"
            placeholder="点击或拖拽PDF文件到此区域上传"
            accept="application/pdf"
            autoUpload={false}
            beforeUpload={beforeUpload}
            onChange={handleUploadChange}
            files={uploadFiles}
            multiple={false}
            max={1}
          >
            <Button theme="default" variant="dashed" icon={<UploadIcon />}>
              点击上传
            </Button>
          </Upload>
          <div style={{ color: '#999', fontSize: '12px', marginTop: '5px' }}>
            支持PDF格式，文件大小不超过10MB
          </div>
        </FormItem>

        <FormItem label="文档标题" rules={[{ required: true, message: '请输入文档标题' }]}>
          <Input
            value={data.title}
            placeholder="请输入文档标题"
            onChange={(value) => onChange('title', value)}
            clearable
          />
        </FormItem>

        <FormItem label="文档描述">
          <Input
            value={data.description}
            placeholder="请输入文档描述"
            onChange={(value) => onChange('description', value)}
            clearable
          />
        </FormItem>
      </Form>
    </div>
  );
}
